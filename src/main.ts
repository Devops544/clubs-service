import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env file from apps/clubs-service/.env
const envPath = resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Also try loading from /app/.env for Docker
dotenv.config({ path: '/app/.env' });

//Federation setup
import { NestFactory } from '@nestjs/core';
import { ClubModule } from './club.module';

async function bootstrap() {
  console.log('🔧 Environment Configuration:');
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || 'NOT SET'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'NOT SET'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'NOT SET'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
  console.log(`   PORT: ${process.env.PORT || '3002'}`);
  console.log('');

  const app = await NestFactory.create(ClubModule);
  // await app.listen(3001); // Clubs service runs on 3001
  // Removed graphql-upload: Apollo Server v4 no longer supports this package

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    origin: true,
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`🚀 Clubs Service running on: http://localhost:${port}/graphql`);
}

bootstrap();
