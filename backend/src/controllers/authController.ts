import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'doctor' | 'patient';
    specialization?: string;
    phone?: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const register = async (req: RegisterRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, specialization, phone } = req.body;
    
    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }
    
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role,
      specialization,
      phone
    });
    res.status(201).json({ 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      specialization: user.specialization,
      phone: user.phone
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: LoginRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'changeme-super-secret',
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
