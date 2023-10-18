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
  total: number;
}

export const validationCategoryCreate: Joi.ObjectSchema<CreateOrUpdateCategoryDTO> =
  Joi.object({
    name: Joi.string().required(),
  });

export const validationUpdateCategory: Joi.ObjectSchema<CreateOrUpdateCategoryDTO> =
  Joi.object({
    name: Joi.string(),
    total: Joi.number(),
  });
