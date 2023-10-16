import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateOrUpdateCategoryDTO {
  @ApiProperty({
    type: String,
    description: 'name of category',
    default: 'Fiqih',
  })
  name: string;
}

export const validationCategoryCreate: Joi.ObjectSchema<CreateOrUpdateCategoryDTO> =
  Joi.object({
    name: Joi.string().required(),
  });
