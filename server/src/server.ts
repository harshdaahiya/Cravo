import { App } from './app.js';
import { configService } from './services/config-service.js';
import { DatabaseService } from './services/database-service.js';
import { LoggerService } from './services/logger-service.js';

class Server {
  public static async start(): Promise<void> {
    try {
      LoggerService.info('Starting server initialization...');

      // 1. Connect to Database
      const dbService = DatabaseService.getInstance(configService.mongoUri);
      await dbService.connect();

      // 2. Initialize and Start Express App
      const appInstance = new App(configService);
      appInstance.listen();

      LoggerService.info('Server successfully started and ready for requests.');
    } catch (error) {
      LoggerService.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Global error handlers
process.on('unhandledRejection', (reason) => {
  LoggerService.error('Unhandled Rejection at Promise:', reason);
  // Optional: Graceful shutdown logic here
});

process.on('uncaughtException', (error) => {
  LoggerService.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

Server.start();
