import { Request, Response } from 'express';
import User from '../models/User'; // assumes Mongoose

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('_id name email');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to load users' });
  }
};
