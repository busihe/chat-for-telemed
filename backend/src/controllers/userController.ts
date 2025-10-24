import { Request, Response } from 'express';
import User from '../models/User';

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
