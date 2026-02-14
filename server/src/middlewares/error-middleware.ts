import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../services/api-error.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error Handler:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    message: message,
    data: null,
    errors: err.errors || [],
  };

  return res.status(statusCode).json(response);
};
