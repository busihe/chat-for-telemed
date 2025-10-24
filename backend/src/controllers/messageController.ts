import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import { getIo } from '../sockets';
import mongoose from 'mongoose';

interface SendMessageRequest extends AuthRequest {
  body: {
    conversationId: string;
    text: string;
  };
}

export const listMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      res.status(400).json({ message: 'conversationId is required' });
      return;
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('List messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: SendMessageRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!conversationId || !text) {
      res.status(400).json({ message: 'Missing conversationId or text' });
      return;
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    if (!conversation.participants.map(String).includes(userId)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const message = await Message.create({
      senderId: userId,
      conversationId,
      text,
    });

    const io = getIo();
    io.to(conversationId).emit('receiveMessage', {
      conversationId,
      message,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!conversationId) {
      res.status(400).json({ message: 'conversationId is required' });
      return;
    }

    const result = await Message.updateMany(
      { conversationId, read: false, senderId: { $ne: userId } },
      { $set: { read: true }, $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } }
    );

    res.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markReadOne = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const conversationId = req.params.conversationId || req.body.conversationId;
    const messageId = req.params.messageId || req.body.messageId;

    if (!conversationId) {
      res.status(400).json({ message: 'conversationId is required' });
      return;
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    if (!conversation.participants.map(String).includes(userId)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    if (messageId) {
      // Mark single message as read
      const updated = await Message.findOneAndUpdate(
        { _id: messageId, conversationId },
        { $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ message: 'Message not found' });
        return;
      }

      // Optional: maintain legacy boolean read for non-sender
      if (!updated.read && String(updated.senderId) !== userId) {
        updated.read = true;
        await updated.save();
      }

      console.log(`[messages] markReadOne user=${userId} conversation=${conversationId} message=${messageId}`);
      res.json(updated);
    } else {
      // Mark all unread messages in conversation as read
      const result = await Message.updateMany(
        { conversationId, read: false, senderId: { $ne: userId } },
        { $set: { read: true }, $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } }
      );

      console.log(`[messages] markReadOne (all) user=${userId} conversation=${conversationId}`);
      res.json({ modifiedCount: result.modifiedCount });
    }
  } catch (error) {
    console.error('Mark single message read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
