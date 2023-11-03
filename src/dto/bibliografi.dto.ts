import * as Joi from 'joi';

export class BibliografiCreateDTO {
  title: string;
  description: string;
  contributor: string;
  creator: string;
  publisher: string;
  source: string;
  image_url: string;
  category: string;
}

export class QueryFindBibliografi {
  title: string;
}
export const validationQueryFindBibliografi: Joi.ObjectSchema<QueryFindBibliografi> =
  Joi.object({
    title: Joi.string(),
  });

export const validationCreateBibliografi: Joi.ObjectSchema<BibliografiCreateDTO> =
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    contributor: Joi.string().required(),
    creator: Joi.string().required(),
    source: Joi.string().required(),
    image_url: Joi.string().required().uri(),
    category: Joi.string().required(),
  });
