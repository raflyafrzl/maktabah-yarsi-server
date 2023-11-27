import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Bibliography } from './bibliografi.schema';

export type contentDocuemnt = HydratedDocument<ListContent>;

export class ListContentHelper {
  @Prop()
  page: number;

  @Prop()
  name: string;

  @Prop({ type: [ListContentHelper] })
  sub: ListContentHelper[];
}
@Schema({ versionKey: false })
export class ListContent {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  page: number;

  @Prop({ required: true, ref: Bibliography.name, type: Types.ObjectId })
  bibliography: Bibliography;

  @Prop({ required: true })
  sub: ListContentHelper[];
}
export const ListOfContentSchema = SchemaFactory.createForClass(ListContent);
