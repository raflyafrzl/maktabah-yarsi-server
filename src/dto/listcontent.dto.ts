import * as Joi from 'joi';
import { ListContentHelper } from 'src/schemas/listcontent.schema';

export class CreateOrListContentDTO {
  page: number;
  name: string;
  bibliography: string;
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
