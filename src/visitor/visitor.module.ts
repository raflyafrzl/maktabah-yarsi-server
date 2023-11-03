import { Module } from '@nestjs/common';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Visitor, VisitorSchema } from 'src/schemas/visitor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: VisitorSchema, name: Visitor.name }]),
  ],
  controllers: [VisitorController],
  providers: [VisitorService],
})
export class VisitorModule {}
