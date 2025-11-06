import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.SSL_REQUIRED && process.env.SSL_REQUIRED === 'false'
      ? false
      : {
          rejectUnauthorized: false,
        },
  entities: ['src/**/*.entity.ts'],
  migrations: ['db/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: false,
});
