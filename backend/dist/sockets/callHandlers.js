"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCallHandlers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Call_1 = __importDefault(require("../models/Call"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const registerCallHandlers = (socket) => {
    socket.on('joinConversation', async (conversationId) => {
        try {
            socket.join(conversationId);
            console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
        }
        catch (error) {
            console.error('Error joining conversation:', error);
            socket.emit('error', { message: 'Failed to join conversation' });
        }
    });
    socket.on('call:initiate', async (data) => {
        try {
            const { conversationId, callerId, receiverId, callType, signal } = data;
            const conversation = await Conversation_1.default.findById(conversationId);
            if (!conversation) {
                socket.emit('call:error', { message: 'Conversation not found' });
                return;
            }
            const isParticipant = conversation.participants.some((p) => p.toString() === callerId || p.toString() === receiverId);
            if (!isParticipant) {
                socket.emit('call:error', { message: 'Not a participant' });
                return;
            }
            const call = new Call_1.default({
                conversationId: new mongoose_1.default.Types.ObjectId(conversationId),
                callerId: new mongoose_1.default.Types.ObjectId(callerId),
                receiverId: new mongoose_1.default.Types.ObjectId(receiverId),
                callType,
                status: 'initiated',
            });
            await call.save();
            socket.to(conversationId).emit('call:incoming', {
                callId: call._id.toString(),
                conversationId,
                callerId,
                callType,
                signal,
            });
            console.log(`Call initiated: ${call._id}`);
        }
        catch (error) {
            console.error('Error initiating call:', error);
            socket.emit('call:error', { message: 'Failed to initiate call' });
        }
    });
    socket.on('call:answer', async (data) => {
        try {
            const { conversationId, callId, signal } = data;
            const call = await Call_1.default.findById(callId);
            if (call) {
                call.status = 'answered';
                call.startedAt = new Date();
                await call.save();
            }
            socket.to(conversationId).emit('call:answered', {
                callId,
                signal,
            });
            console.log(`Call answered: ${callId}`);
        }
        catch (error) {
            console.error('Error answering call:', error);
            socket.emit('call:error', { message: 'Failed to answer call' });
        }
    });
    socket.on('call:reject', async (data) => {
        try {
            const { callId, conversationId } = data;
            const call = await Call_1.default.findById(callId);
            if (call) {
                call.status = 'rejected';
                call.endedAt = new Date();
                await call.save();
            }
            socket.to(conversationId).emit('call:rejected', { callId });
            console.log(`Call rejected: ${callId}`);
        }
        catch (error) {
            console.error('Error rejecting call:', error);
        }
    });
    socket.on('call:end', async (data) => {
        try {
            const { conversationId, callId } = data;
            const call = await Call_1.default.findById(callId);
            if (call) {
                call.endedAt = new Date();
                call.status = 'ended';
                if (call.startedAt) {
                    const duration = Math.floor((call.endedAt.getTime() - call.startedAt.getTime()) / 1000);
                    call.duration = duration;
                }
                await call.save();
            }
            socket.to(conversationId).emit('call:ended', { callId });
            console.log(`Call ended: ${callId}`);
        }
        catch (error) {
            console.error('Error ending call:', error);
        }
    });
    socket.on('call:iceCandidate', (data) => {
        const { conversationId, candidate } = data;
        socket.to(conversationId).emit('call:iceCandidate', { candidate });
    });
    socket.on('call:offer', (data) => {
        const { conversationId, offer } = data;
        socket.to(conversationId).emit('call:offer', { offer });
    });
    socket.on('call:remoteAnswer', (data) => {
        const { conversationId, answer } = data;
        socket.to(conversationId).emit('call:remoteAnswer', { answer });
    });
    socket.on('leaveConversation', (conversationId) => {
        socket.leave(conversationId);
        console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });
};
exports.registerCallHandlers = registerCallHandlers;
//# sourceMappingURL=callHandlers.js.map