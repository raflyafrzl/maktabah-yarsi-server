import * as Joi from 'joi';

export default interface CreateOrUpdateUserDTO {
  username: string;
  password: string;
  email: string;
}

export interface UserSignInDTO {
  username: string;
  password: string;
}

export const validationCreateUser: Joi.ObjectSchema<CreateOrUpdateUserDTO> =
  Joi.object({
    username: Joi.string().min(5, 'utf-8').required(),
    password: Joi.string().min(5, 'utf-8').required(),
    email: Joi.string().email().required(),
  });

export const validationUpdateUser: Joi.ObjectSchema<CreateOrUpdateUserDTO> =
  Joi.object({
    username: Joi.string().min(5, 'utf-8'),
    password: Joi.string().min(5, 'utf-8'),
    email: Joi.string().email(),
  });

export const validationSignIn: Joi.ObjectSchema<UserSignInDTO> = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
