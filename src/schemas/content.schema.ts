import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ListContent } from './listcontent.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export class ContentHelper {
  @Prop()
  header: string;
  @Prop()
  text: string;
}

export type ContentDocument = HydratedDocument<Content>;

@Schema({ versionKey: false })
export class Content {
  @Prop({ type: String, required: true })
  header: string;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true })
  listcontent: ListContent;
}

export const contentSchema: mongoose.Schema<Content> =
  SchemaFactory.createForClass(Content);
