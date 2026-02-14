import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user-model.js';
import { TokenService } from '../services/token-service.js';
import { LoggerService } from '../services/logger-service.js';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return next();
  }

  try {
    const decodedToken = TokenService.validateToken(token);
    const user = await UserModel.findById(decodedToken?._id).select('-password -refreshTokens');

    if (user) {
      req.user = user;
    }
    next();
  } catch (error: any) {
    LoggerService.error('Error validating token:', error.message);
    next();
  }
};

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized request: You must be logged in.'
    });
  }
  next();
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if (!user || !user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: User authentication or role information missing.'
      });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access Denied: You do not have the required permission (${user.role}).`
      });
    }
    next();
  };
};
