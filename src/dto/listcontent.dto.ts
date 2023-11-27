import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { ListContentHelper } from 'src/schemas/listcontent.schema';

export class CreateOrListContentDTO {
  @ApiProperty({
    name: 'page',
    description: 'page of the list content',
    default: 5,
    type: Number,
  })
  page: number;
  @ApiProperty({
    name: 'name',
    description: 'name of the list content',
    default: 'bab 1 ',
    type: String,
  })
  name: string;
  @ApiProperty({
    name: 'bibliography',
    description: 'id of the bibliography corresponding with',
    default: '123123ididid',
    type: String,
  })
  bibliography: string;
  @ApiProperty({
    name: 'sub',
    description: 'page of the list content',
    default: [
      {
        page: 3,
        name: 'ini bagian juga',
        sub: [
          {
            name: 'ini bagian tapi lebih dalam',
            page: 4,
          },
        ],
      },
      {
        page: 10,
        name: 'ini bagian juga',
      },
    ],
    type: [ListContentHelper],
  })
  sub: ListContentHelper[];
}
export const validationCreateListContentDTO: Joi.ObjectSchema<CreateOrListContentDTO> =
  Joi.object({
    page: Joi.number().required(),
    name: Joi.string().required(),
    bibliography: Joi.string().required(),
    sub: Joi.array().items(Joi.any()).required(),
  });

export const validationUpdateListContentDTO: Joi.ObjectSchema<CreateOrListContentDTO> =
  Joi.object({
    page: Joi.number(),
    name: Joi.string(),
    bibliography: Joi.string(),
    sub: Joi.array().items(Joi.any()),
  });
