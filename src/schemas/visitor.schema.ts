import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as Joi from 'joi';
import * as moment from 'moment';

export type VisitorDocument = HydratedDocument<Visitor>;

@Schema({
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.id;
    },
  },
})
export class Visitor {
  @Prop({ required: true })
  total: number;
  @Prop({ required: true })
  month: string;
  @Prop({ required: true })
  range: number;
  @Prop({ required: true, type: Number })
  year: number;
}

export class QueryParamVisitorDTO {
  month: string;
  year: string;
}

export const validationQueryVisitor: Joi.ObjectSchema<QueryParamVisitorDTO> =
  Joi.object({
    month: Joi.string()
      .valid(
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'oktober',
        'november',
        'december',
      )
      .required(),
    year: Joi.number().required(),
  });

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
VisitorSchema.virtual('day').get(function () {
  return moment().locale('id').format('dddd');
});
