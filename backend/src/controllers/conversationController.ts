import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import mongoose from 'mongoose';

interface CreateConversationRequest extends AuthRequest {
  body: {
    participantIds: string[];
  };
}

export const listConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1) Fetch conversations for the user and populate participants (name, role)
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name role')
      .lean();

    const convIds: mongoose.Types.ObjectId[] = conversations.map((c: any) => c._id as mongoose.Types.ObjectId);

    // If none, short-circuit with empty array shape
    if (convIds.length === 0) {
      const empty: any[] = [];
      console.log(`[conversations] user=${userId} fetched=0`);
      res.json({ conversations: empty });
      return;
    }

    // 2) Get last message per conversation
    const lastMessages = await Message.aggregate([
      { $match: { conversationId: { $in: convIds } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', doc: { $first: '$$ROOT' } } },
    ]);
    const lastMap = new Map<string, any>(
      lastMessages.map((m) => [String(m._id), m.doc])
    );

    // 3) Get unread counts for the current user (exclude own messages)
    const unreadCounts = await Message.aggregate([
      { $match: { conversationId: { $in: convIds }, read: false, senderId: { $ne: new mongoose.Types.ObjectId(userId) } } },
      { $group: { _id: '$conversationId', count: { $sum: 1 } } },
    ]);
    const unreadMap = new Map<string, number>(
      unreadCounts.map((u) => [String(u._id), u.count as number])
    );

    // 4) Sanitize and shape the response
    const sanitized = conversations.map((conv: any) => {
      const participants = Array.isArray(conv.participants) ? conv.participants : [];
      const last = lastMap.get(String(conv._id));
      return {
        _id: String(conv._id),
        participants: participants.map((p: any) => ({
          _id: String(p._id),
          name: p.name,
          role: p.role,
        })),
        lastMessage: last
          ? {
              _id: String(last._id),
              conversationId: String(last.conversationId),
              senderId: String(last.senderId),
              text: last.text,
              read: !!last.read,
              createdAt: last.createdAt,
            }
          : null,
        unreadCount: unreadMap.get(String(conv._id)) || 0,
      };
    });

    // 5) Log fetched data for debugging
    console.log(`[conversations] user=${userId} fetched=${sanitized.length}`);
    console.log(`[conversations] data=${JSON.stringify(sanitized, null, 2)}`);

    // 6) Always return an array shape under { conversations }
    res.json({ conversations: sanitized });
  } catch (error) {
    console.error('List conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createConversation = async (req: CreateConversationRequest, res: Response): Promise<void> => {
  try {
    const { participantIds } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const unique = Array.from(new Set([...(participantIds || []), userId]));
    if (unique.length < 2) {
      res.status(400).json({ message: 'Need at least two participants' });
      return;
    }
    
    const existing = await Conversation.findOne({ 
      participants: { $all: unique, $size: unique.length } 
    });
    
    if (existing) {
      res.status(200).json(existing);
      return;
    }
    
    const conversation = await Conversation.create({ participants: unique });
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
