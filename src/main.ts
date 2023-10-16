import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

dotenv.config();
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Maktabah Yarsi API Documentation')
    .setDescription(
      'Berisikan endpoint-endpoint yang dimiliki oleh Maktabah YARSI API',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Input valid credential here',
        type: 'http',
        in: 'Header',
        name: 'Authorization',
        bearerFormat: 'Bearer',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
