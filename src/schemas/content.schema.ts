import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ListContent } from './listcontent.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export class ContentHelper {
  heading: string;
  page: number;
  text: string;
}

export type ContentDocument = HydratedDocument<Content>;

@Schema({ versionKey: false })
export class Content {
  @Prop({ type: String, required: true })
  heading: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: ListContent.name,
    unique: true,
  })
  listcontent: ListContent;

  @Prop({ type: Number, required: true })
  page: number;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ required: true })
  sub: ContentHelper[];
}

export const ContentSchema: mongoose.Schema<Content> =
  SchemaFactory.createForClass(Content);
