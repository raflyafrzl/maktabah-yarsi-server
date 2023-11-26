import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, contentSchema } from 'src/schemas/content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: contentSchema }]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
