import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from 'src/schemas/content.schema';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    SearchModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
