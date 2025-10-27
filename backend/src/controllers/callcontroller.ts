import { Request, Response } from 'express';
import Call from '../models/Call';
import { AuthRequest } from '../middleware/auth';

// Create a new call
export const createCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, receiverId, callType } = req.body;

    if (!conversationId || !receiverId || !callType) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const newCall = await Call.create({
      conversationId,
      callerId: req.user?.id,
      receiverId,
      callType,
      status: 'initiated',
      startedAt: new Date(),
    });

    res.status(201).json(newCall);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create call', error });
  }
};

// Update call status (answered, ended, missed, rejected)
export const updateCallStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const call = await Call.findById(id);
    if (!call) {
      res.status(404).json({ message: 'Call not found' });
      return;
    }

    // Update status and timestamps
    if (status === 'answered') call.startedAt = new Date();
    if (status === 'ended') {
      call.endedAt = new Date();
      if (call.startedAt) {
        call.duration = Math.floor((call.endedAt.getTime() - call.startedAt.getTime()) / 1000);
      }
    }

    call.status = status;
    await call.save();

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update call status', error });
  }
};

// Get all calls for the authenticated user
export const getMyCalls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const calls = await Call.find({
      $or: [{ callerId: userId }, { receiverId: userId }],
    })
      .populate('callerId', 'name email')
      .populate('receiverId', 'name email')
      .populate('conversationId', 'participants')
      .sort({ createdAt: -1 });

    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch calls', error });
  }
};

// Get a single call by ID
export const getCallById = async (req: Request, res: Response): Promise<void> => {
  try {
    const call = await Call.findById(req.params.id)
      .populate('callerId', 'name email')
      .populate('receiverId', 'name email')
      .populate('conversationId', 'participants');

    if (!call) {
      res.status(404).json({ message: 'Call not found' });
      return;
    }

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch call', error });
  }
};
