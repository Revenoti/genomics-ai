import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from '@shared/schema';
import ws from 'ws';

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

// Construct database URL from environment variables
const getDatabaseUrl = (): string | null => {
  // Check if DATABASE_URL is explicitly set
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // For Supabase, you need to get the direct PostgreSQL connection string from your dashboard
  // It's typically under Project Settings > Database > Connection String (Direct connection or Pooler)
  // The format is: postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
  
  console.warn('DATABASE_URL not found. Please set DATABASE_URL environment variable with your Supabase PostgreSQL connection string.');
  console.warn('You can find it in Supabase Dashboard > Project Settings > Database > Connection String');
  return null;
};

const databaseUrl = getDatabaseUrl();

// Create database connection using neon-serverless (supports .returning())
let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (databaseUrl) {
  pool = new Pool({ connectionString: databaseUrl });
  dbInstance = drizzle(pool, { schema });
}

export const db = dbInstance;

// Helper to check if database is configured
export const isDatabaseConfigured = (): boolean => {
  return db !== null;
};
