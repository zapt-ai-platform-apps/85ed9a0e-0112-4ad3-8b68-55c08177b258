import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import Sentry from './_sentry.js';

export function getDbClient() {
  try {
    const connectionString = process.env.COCKROACH_DB_URL;
    if (!connectionString) {
      throw new Error('Missing database connection string');
    }
    
    const client = postgres(connectionString);
    return drizzle(client);
  } catch (error) {
    console.error('Database connection error:', error);
    Sentry.captureException(error);
    throw error;
  }
}