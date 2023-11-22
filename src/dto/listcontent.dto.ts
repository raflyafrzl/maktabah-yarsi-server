import * as Joi from 'joi';
import { ListContentHelper } from 'src/schemas/listcontent.schema';

export class CreateListContentDTO {
  page: number;
  name: string;
  bibliography: string;
  sub: ListContentHelper[];
}
export const validationCreateListContentDTO: Joi.ObjectSchema<CreateListContentDTO> =
  Joi.object({
    page: Joi.number().required(),
    name: Joi.string().required(),
    bibliography: Joi.string().required(),
    sub: Joi.array().items(Joi.any()),
  });
