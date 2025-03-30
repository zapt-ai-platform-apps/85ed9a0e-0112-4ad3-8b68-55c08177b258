import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import Sentry from './_sentry.js';

export function getDbClient() {
  try {
    const connectionString = process.env.COCKROACH_DB_URL;
    if (!connectionString) {
      throw new Error('Missing database connection string');
    }
    
    // Configure the postgres client with proper error handling
    const client = postgres(connectionString, {
      idle_timeout: 20,
      max_lifetime: 60 * 30,
      connect_timeout: 10
    });
    
    return drizzle(client);
  } catch (error) {
    console.error('Database connection error:', error);
    Sentry.captureException(error);
    throw error;
  }
}