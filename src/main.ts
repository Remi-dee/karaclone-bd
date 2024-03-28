import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorMiddleware } from './middleware/Error';
import { NestExpressApplication } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import {config as dotenvConfig} from "dotenv"
// require('dotenv').config();
dotenvConfig()
process.env.gNODE_TLS_REJECT_UNAUTHORIZED = '0';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.setViewEngine('hbs');

  app.use(ErrorMiddleware);

  const config = new DocumentBuilder()
    .setTitle('FXKARA API DOCS')
    .setDescription('Documentation for fxKara api')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  // cloudinary config
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
