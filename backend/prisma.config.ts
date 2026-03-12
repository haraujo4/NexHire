import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

// Load .env so process.env variables are available for the CLI
dotenv.config();

const url = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}?schema=public`;

export default defineConfig({
    datasource: {
        url: url,
    },
});
