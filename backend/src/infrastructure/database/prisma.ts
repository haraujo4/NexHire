const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Construct Connection String
const user = encodeURIComponent(process.env.POSTGRES_USER || 'postgres');
const password = encodeURIComponent(process.env.POSTGRES_PASSWORD || 'postgrespw');
const host = process.env.POSTGRES_HOST || 'db';
const port = process.env.POSTGRES_PORT || '5432';
const db = process.env.POSTGRES_DB || 'rhlegal';

const connectionString = `postgresql://${user}:${password}@${host}:${port}/${db}?schema=public`;

// Create PG Pool
const pool = new Pool({ connectionString });

// Instantiate Adapter
const adapter = new PrismaPg(pool);

// Instantiate Prisma Client with Adapter
export const prisma = new PrismaClient({ adapter });
