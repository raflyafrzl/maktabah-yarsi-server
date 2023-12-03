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
