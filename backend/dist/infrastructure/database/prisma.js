"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
// Construct Connection String
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}?schema=public`;
// Create PG Pool
const pool = new Pool({ connectionString });
// Instantiate Adapter
const adapter = new PrismaPg(pool);
// Instantiate Prisma Client with Adapter
exports.prisma = new PrismaClient({ adapter });
