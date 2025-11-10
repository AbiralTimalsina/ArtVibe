import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { IUser, UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  console.log('Authorization header:', req.headers.authorization);

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted:', token ? 'Yes' : 'No');
  }

  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: UserRole };
    console.log('Decoded token:', decoded);
    
    const user = await UserModel.findById(decoded.id).select('-password');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.log('Token verification error:', err);
    return res.status(401).json({ message: 'Token invalid' });
  }
};