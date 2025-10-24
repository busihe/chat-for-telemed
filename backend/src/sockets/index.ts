import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { registerCallHandlers } from './callHandlers';

let ioInstance: SocketIOServer | null = null;

export const initSocket = (server: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(server, { 
    cors: { origin: '*' } 
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('typing', ({ roomId, userId, isTyping }: { roomId: string; userId: string; isTyping: boolean }) => {
      socket.to(roomId).emit('typing', { userId, isTyping });
    });

    socket.on('sendMessage', ({ roomId, message }: { roomId: string; message: any }) => {
      socket.to(roomId).emit('receiveMessage', { roomId, message });
    });

    // Register WebRTC call handlers
    registerCallHandlers(socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  ioInstance = io;
  return io;
};

export const setIo = (io: SocketIOServer): void => {
  ioInstance = io;
};

export const getIo = (): SocketIOServer => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
};
