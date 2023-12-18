import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';
import { Bibliography } from './bibliografi.schema';

export type ContentDocument = HydratedDocument<Content>;

export class ContentHelper {
  text: string;
  heading: string;
  page: number;
}

@Schema({ versionKey: false })
export class Content {
  @Prop({ type: String, required: true })
  heading: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: Bibliography.name,
  })
  bibliography: Bibliography;

  @Prop({ type: Number, required: true })
  page: number;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop()
  sub: ContentHelper[];
}

export const ContentSchema: mongoose.Schema<Content> =
  SchemaFactory.createForClass(Content);
