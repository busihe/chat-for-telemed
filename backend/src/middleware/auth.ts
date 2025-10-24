import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme-super-secret') as JWTPayload;
    req.user = payload;
    next();
  } catch (_e) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
};
