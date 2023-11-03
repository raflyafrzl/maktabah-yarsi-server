import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as Joi from 'joi';

export type VisitorDocument = HydratedDocument<Visitor>;

@Schema({ versionKey: false })
export class Visitor {
  @Prop({ required: true })
  total: number;
  @Prop({ required: true })
  month: string;
  @Prop({ required: true })
  date: string;
  @Prop({ required: true, type: Number })
  year: number;
}

export const validationVisitor = Joi.string().valid(
  'januari',
  'februari',
  'maret',
  'april',
  'mei',
  'juni',
  'juli',
  'agustus',
  'september',
  'oktober',
  'november',
  'desember',
);

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
