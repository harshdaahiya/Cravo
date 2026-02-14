import mongoose from 'mongoose';
import { LoggerService } from './logger-service.js';

export class DatabaseService {
  private static instance: DatabaseService;
  private readonly MONGO_URI: string;
  private readonly DB_NAME: string = 'CravingCartDB';

  private constructor(mongoUri: string) {
    this.MONGO_URI = mongoUri;
  }

  public static getInstance(mongoUri: string): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(mongoUri);
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      const connectionInstance = await mongoose.connect(
        `${this.MONGO_URI}/${this.DB_NAME}`
      );
      LoggerService.info(
        `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
      );
    } catch (error) {
      LoggerService.error('MONGODB connection FAILED ', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      LoggerService.info('MongoDB disconnected');
    } catch (error) {
      LoggerService.error('Error disconnecting MongoDB: ', error);
    }
  }
}
