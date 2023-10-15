import * as Joi from 'joi';

export interface CreateOrUpdateCategoryDTO {
  name: string;
}

export const validationCategoryCreate: Joi.ObjectSchema<CreateOrUpdateCategoryDTO> =
  Joi.object({
    name: Joi.string().required(),
  });
