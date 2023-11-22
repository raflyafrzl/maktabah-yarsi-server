import { Module } from '@nestjs/common';
import { ListcontentController } from './listcontent.controller';
import { ListcontentService } from './listcontent.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ListContent,
  ListOfContentSchema,
} from 'src/schemas/listcontent.schema';
import { BiblioSchema, Bibliography } from 'src/schemas/bibliografi.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ListContent.name, schema: ListOfContentSchema },
    ]),
    MongooseModule.forFeature([
      { name: Bibliography.name, schema: BiblioSchema },
    ]),
  ],
  controllers: [ListcontentController],
  providers: [ListcontentService],
})
export class ListcontentModule {}
