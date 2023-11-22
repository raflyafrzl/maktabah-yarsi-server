import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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
@Schema()
export class ListContent {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 0 })
  page: number;

  @Prop({ required: true, ref: Bibliography.name })
  bibliography: Bibliography;

  @Prop({ required: true })
  sub: ListContentHelper[];
}
export const ListOfContentSchema = SchemaFactory.createForClass(ListContent);
