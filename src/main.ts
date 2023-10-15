import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

dotenv.config();
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
