import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { registerCallHandlers } from "./callHandlers";

let ioInstance: SocketIOServer | null = null;
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initSocket = (server: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // ✅ Handle user presence (online)
    socket.on("user:online", ({ userId }) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      console.log(`🟢 ${userId} is online`);

      // Notify all clients about updated online users
      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys()).map((id) => ({
          _id: id,
          name: `User-${id}`,
        }))
      );
    });

    // ✅ Handle joining a chat room
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`👥 ${socket.id} joined room ${roomId}`);
    });

    // ✅ Handle typing events
    socket.on(
      "typing",
      ({
        roomId,
        userId,
        isTyping,
      }: {
        roomId: string;
        userId: string;
        isTyping: boolean;
      }) => {
        socket.to(roomId).emit("typing", { userId, isTyping });
      }
    );

    // ✅ Handle message sending
    socket.on("sendMessage", ({ roomId, message }) => {
      socket.to(roomId).emit("receiveMessage", { roomId, message });
    });

    // ✅ Register WebRTC / call handlers
    registerCallHandlers(socket, io);

    // ✅ Handle disconnect (offline)
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`🔴 ${userId} went offline`);
          break;
        }
      }

      // Notify all clients again after disconnect
      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys()).map((id) => ({
          _id: id,
          name: `User-${id}`,
        }))
      );
    });
  });

  ioInstance = io;
  return io;
};

export const setIo = (io: SocketIOServer): void => {
  ioInstance = io;
};

export const getIo = (): SocketIOServer => {
  if (!ioInstance) throw new Error("Socket.io not initialized");
  return ioInstance;
};
