import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/v1/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: [''],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('FXKARA V1 API DOCS')
    .setDescription('Documentation for fxKara v1 api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/v1/api/docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
