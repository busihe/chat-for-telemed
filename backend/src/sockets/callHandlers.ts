import { Server, Socket } from 'socket.io';

interface CallData {
  callId: string;
  callerId: string;
  receiverId: string;
  callType: 'video' | 'audio';
}

const onlineUsers: Record<string, string> = {}; // socket.id -> userId

export const registerCallHandlers = (socket: Socket, io: Server): void => {
  // ✅ Track online users
  socket.on('user:online', ({ userId }: { userId: string }) => {
    onlineUsers[socket.id] = userId;
    io.emit(
      'onlineUsers',
      Object.entries(onlineUsers).map(([_, id]) => ({ _id: id, name: `User-${id}` }))
    );
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit(
      'onlineUsers',
      Object.entries(onlineUsers).map(([_, id]) => ({ _id: id, name: `User-${id}` }))
    );
  });

  // ✅ Initiate call
  socket.on('call:initiate', (data: CallData) => {
    const { receiverId } = data;
    const receiverSocketId = Object.keys(onlineUsers).find((sid) => onlineUsers[sid] === receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('call:incoming', data);
    }
  });

  // ✅ Answer call
  socket.on('call:answer', (data: { callId: string }) => {
    io.emit('call:answered', data);
  });

  // ✅ Reject call
  socket.on('call:reject', (data: { callId: string }) => {
    io.emit('call:rejected', data);
  });

  // ✅ End call
  socket.on('call:end', (data: { callId: string }) => {
    io.emit('call:ended', data);
  });
};
