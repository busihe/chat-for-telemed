import { Socket } from 'socket.io';
import mongoose from 'mongoose';
import Call from '../models/Call';
import Conversation from '../models/Conversation';

// ✅ Define your own simplified WebRTC-related types for Node environment
interface RTCIceCandidateInit {
  candidate?: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
}

interface RTCSessionDescriptionInit {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
}

interface CallSignalData {
  conversationId: string;
  callerId: string;
  receiverId: string;
  callType: 'video' | 'audio';
  signal?: any;
}

interface CallAnswerData {
  conversationId: string;
  callId: string;
  signal?: any;
}

interface ICECandidateData {
  conversationId: string;
  candidate: RTCIceCandidateInit;
}

interface EndCallData {
  conversationId: string;
  callId: string;
}

export const registerCallHandlers = (socket: Socket): void => {
  // Join a conversation room
  socket.on('joinConversation', async (conversationId: string) => {
    try {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    } catch (error) {
      console.error('Error joining conversation:', error);
      socket.emit('error', { message: 'Failed to join conversation' });
    }
  });

  // Initiate a call
  socket.on('call:initiate', async (data: CallSignalData) => {
    try {
      const { conversationId, callerId, receiverId, callType, signal } = data;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        socket.emit('call:error', { message: 'Conversation not found' });
        return;
      }

      const isParticipant = conversation.participants.some(
        (p: any) => p.toString() === callerId || p.toString() === receiverId
      );

      if (!isParticipant) {
        socket.emit('call:error', { message: 'Not a participant' });
        return;
      }

      const call = new Call({
        conversationId: new mongoose.Types.ObjectId(conversationId),
        callerId: new mongoose.Types.ObjectId(callerId),
        receiverId: new mongoose.Types.ObjectId(receiverId),
        callType,
        status: 'initiated',
      });

      await call.save();

      socket.to(conversationId).emit('call:incoming', {
        callId: (call as any)._id.toString(),
        conversationId,
        callerId,
        callType,
        signal,
      });

      console.log(`Call initiated: ${(call as any)._id}`);
    } catch (error) {
      console.error('Error initiating call:', error);
      socket.emit('call:error', { message: 'Failed to initiate call' });
    }
  });

  // Answer a call
  socket.on('call:answer', async (data: CallAnswerData) => {
    try {
      const { conversationId, callId, signal } = data;

      const call = await Call.findById(callId);
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
    } catch (error) {
      console.error('Error answering call:', error);
      socket.emit('call:error', { message: 'Failed to answer call' });
    }
  });

  // Reject a call
  socket.on('call:reject', async (data: { callId: string; conversationId: string }) => {
    try {
      const { callId, conversationId } = data;

      const call = await Call.findById(callId);
      if (call) {
        call.status = 'rejected';
        call.endedAt = new Date();
        await call.save();
      }

      socket.to(conversationId).emit('call:rejected', { callId });

      console.log(`Call rejected: ${callId}`);
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  });

  // End a call
  socket.on('call:end', async (data: EndCallData) => {
    try {
      const { conversationId, callId } = data;

      const call = await Call.findById(callId);
      if (call) {
        call.endedAt = new Date();
        call.status = 'ended';

        if (call.startedAt) {
          const duration = Math.floor(
            (call.endedAt.getTime() - call.startedAt.getTime()) / 1000
          );
          call.duration = duration;
        }

        await call.save();
      }

      socket.to(conversationId).emit('call:ended', { callId });

      console.log(`Call ended: ${callId}`);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  });

  // ICE candidate exchange
  socket.on('call:iceCandidate', (data: ICECandidateData) => {
    const { conversationId, candidate } = data;
    socket.to(conversationId).emit('call:iceCandidate', { candidate });
  });

  // WebRTC offer
  socket.on('call:offer', (data: { conversationId: string; offer: RTCSessionDescriptionInit }) => {
    const { conversationId, offer } = data;
    socket.to(conversationId).emit('call:offer', { offer });
  });

  // WebRTC answer
  socket.on('call:remoteAnswer', (data: { conversationId: string; answer: RTCSessionDescriptionInit }) => {
    const { conversationId, answer } = data;
    socket.to(conversationId).emit('call:remoteAnswer', { answer });
  });

  // Leave conversation
  socket.on('leaveConversation', (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });
};
