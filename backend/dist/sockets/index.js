"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.setIo = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const callHandlers_1 = require("./callHandlers");
let ioInstance = null;
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: '*' }
    });
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });
        socket.on('typing', ({ roomId, userId, isTyping }) => {
            socket.to(roomId).emit('typing', { userId, isTyping });
        });
        socket.on('sendMessage', ({ roomId, message }) => {
            socket.to(roomId).emit('receiveMessage', { roomId, message });
        });
        (0, callHandlers_1.registerCallHandlers)(socket);
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    ioInstance = io;
    return io;
};
exports.initSocket = initSocket;
const setIo = (io) => {
    ioInstance = io;
};
exports.setIo = setIo;
const getIo = () => {
    if (!ioInstance) {
        throw new Error('Socket.io not initialized');
    }
    return ioInstance;
};
exports.getIo = getIo;
//# sourceMappingURL=index.js.map