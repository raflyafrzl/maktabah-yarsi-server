import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import mongoose from 'mongoose';
import { ContentHelper } from 'src/schemas/content.schema';

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
  bibliography: string;
  @ApiProperty({
    type: Number,
    description: 'page of the content',
    default: 2,
  })
  page: number;
  @ApiProperty({
    type: Number,
    description: 'size of the content',
    default: 1,
  })
  size: number;
  @ApiProperty({
    type: [ContentHelper],
    description: 'sub content',
    default: [],
  })
  sub: ContentHelper[];
}

export class QueryContent {
  @ApiProperty({
    type: Number,
    description: 'page query',
    example: 5,
  })
  page: number;
  @ApiProperty({
    type: Number,
    description: 'page query',
    example: 1,
  })
  size: number;
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
  @ApiProperty({
    type: Boolean,
    default: true,
    description: 'exact match or not',
  })
  wild_card: boolean;
}

export class ContentSearch {
  bibliography_title: string;
  id_bibliography: string;
  author: string;
  text: string;
  page: number;
  heading: string;
  id_content: string;
}

export const validationCreateContent: Joi.ObjectSchema<CreateOrUpdateContentDTO> =
  Joi.object({
    heading: Joi.string().required(),
    text: Joi.string().required(),
    page: Joi.number().required(),
    size: Joi.number(),
    sub: Joi.array(),
    bibliography: Joi.custom((value: string, helper) => {
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
    wild_card: Joi.boolean(),
  });

export const validationUpdateContent: Joi.ObjectSchema<CreateOrUpdateContentDTO> =
  Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
    page: Joi.number(),
    size: Joi.number(),
    sub: Joi.array(),
    bibliography: Joi.custom((value: string, helper) => {
      if (mongoose.Types.ObjectId.isValid(value)) return value;

      return helper.error('invalid listcontent id');
    }),
  });

export const validationQueryContent: Joi.ObjectSchema<QueryContent> =
  Joi.object({
    page: Joi.number().min(1).required(),
    size: Joi.number().min(1).required(),
  });
