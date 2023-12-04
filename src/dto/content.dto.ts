import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import mongoose from 'mongoose';

export class CreateOrUpdateContentDTO {
  @ApiProperty({
    type: String,
    description: 'heading of the content',
    default: 'Fiqih',
  })
  heading: string;
  @ApiProperty({
    type: String,
    description: 'text of the content',
    default: 'lorem ipsum dolor sit amet......',
  })
  text: string;
  @ApiProperty({
    type: String,
    description: 'id dari listcontent',
    default: '123asdasdavzxczxc',
  })
  listcontent: string;
  @ApiProperty({
    type: Number,
    description: 'page of the content',
    default: 2,
  })
  page: number;
}

export class QuerySearch {
  @ApiProperty({
    type: String,
    default: '[match | match_phrase]',
    description: 'in which way the data will be searched',
  })
  type: string;
  @ApiProperty({
    type: String,
    default: 'heading',
    description:
      'key of the object, based what field the data will be searched',
  })
  key: string;
  @ApiProperty({
    type: String,
    default: 'fiqih',
    description: 'value of the key',
  })
  value: string;
  @ApiProperty({
    type: String,
    default: 'contents',
    description: 'which index(db) user looking for the document(data)',
  })
  index: string;
}

export const validationCreateContent: Joi.ObjectSchema<CreateOrUpdateContentDTO> =
  Joi.object({
    heading: Joi.string().required(),
    text: Joi.string().required(),
    page: Joi.number().required(),
    listcontent: Joi.custom((value: string, helper) => {
      if (mongoose.Types.ObjectId.isValid(value)) return value;

      return helper.error('invalid listcontent id');
    }).required(),
  });

export const validationSearchElastic: Joi.ObjectSchema<QuerySearch> =
  Joi.object({
    index: Joi.string().valid('contents'),
    type: Joi.string().valid('match_phrase', 'match'),
    key: Joi.string(),
    value: Joi.string(),
  });

export const validationUpdateContent: Joi.ObjectSchema<CreateOrUpdateContentDTO> =
  Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
    page: Joi.number(),
    listcontent: Joi.custom((value: string, helper) => {
      if (mongoose.Types.ObjectId.isValid(value)) return value;

      return helper.error('invalid listcontent id');
    }),
  });
