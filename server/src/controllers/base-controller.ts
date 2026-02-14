import { Response } from 'express';
import { LoggerService } from '../services/logger-service.js';

export abstract class BaseController {
  protected sendSuccess(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected sendError(res: Response, message: string = 'Internal Server Error', statusCode: number = 500, error: any = null) {
    if (error) {
      LoggerService.error(`[Controller Error] ${message}:`, error);
    }
    return res.status(statusCode).json({
      success: false,
      message,
      errors: error ? [error] : [],
    });
  }
}
