import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Bibliography } from './bibliografi.schema';

export type contentDocuemnt = HydratedDocument<ListContent>;

export class ListContentHelper {
  page: number;
  name: string;
  sub: ListContentHelper[];
}
export class ListContent {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 0 })
  page: number;

  @Prop({ required: true, ref: Bibliography.name })
  bibliography: Bibliography;

  @Prop({ required: true, type: [ListContentHelper] })
  sub: ListContentHelper[];
}
export const ListOfContentSchema = SchemaFactory.createForClass(ListContent);
