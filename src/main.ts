import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorMiddleware } from './middleware/Error';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cloudinary from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';
import * as bodyParser from 'body-parser';
// require('dotenv').config();
dotenvConfig();
process.env.gNODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.setViewEngine('hbs');

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
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
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
  });

  app.listen(port, () => console.log(`Server started on port ${port}`));
}
bootstrap();
