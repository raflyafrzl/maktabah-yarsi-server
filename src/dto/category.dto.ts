import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateOrUpdateCategoryDTO {
  @ApiProperty({
    type: String,
    description: 'name of category',
    default: 'Fiqih',
  })
  name: string;
  @ApiProperty({
    type: Number,
    description: 'list books in the category',
    default: 0,
  })
  total?: number | undefined;

  @ApiProperty({
    type: String,
    description: 'parent of the category',
    default: null,
  })
  category: string;
}

export class QueryParamCategoryDTO {
  result: string;
}

export const validationCategoryCreate: Joi.ObjectSchema<CreateOrUpdateCategoryDTO> =
  Joi.object({
    id: Joi.string(),
    category: Joi.string(),
    name: Joi.string().required(),
  });

export const validationUpdateCategory: Joi.ObjectSchema<CreateOrUpdateCategoryDTO> =
  Joi.object({
    name: Joi.string(),
    total: Joi.number(),
  });

export const validationQueryCategory: Joi.ObjectSchema<QueryParamCategoryDTO> =
  Joi.object({
    result: Joi.string().valid('sub', 'category'),
  });
