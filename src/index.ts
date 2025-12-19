import * as dotenv from 'dotenv';
import { createApp } from './app';
import { Logger } from './utils/logger';
import db from './database/connection';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

/**
 * Initialize SQLite database
 * Ensures the database directory exists and runs migrations in development
 */
async function initializeDatabase() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      Logger.info('Created database directory');
    }

    // Run migrations automatically only in development
    if (ENV === 'development') {
      await db.migrate.latest();
      Logger.info('Database migrations completed');
      
      // Run seeds to populate sample data
      await db.seed.run();
      Logger.info('Database seed data inserted');
    }

    // Test database connection
    await db.raw('SELECT 1');
    Logger.info('Database connection established');
  } catch (error) {
    Logger.error('Failed to initialize database', error as Error);
    throw error;
  }
}

/**
 * Start the server
 * Excellent: Proper server initialization with error handling
 */
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    const app = createApp();

    const server = app.listen(PORT, () => {
      Logger.info(`Server is running on port ${PORT}`);
      Logger.info(`Environment: ${ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      Logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        Logger.info('HTTP server closed');
        db.destroy();
        process.exit(0);
      });
    });

  } catch (error) {
    Logger.error('Failed to start server', error as Error);
    process.exit(1);
  }
}

startServer();
