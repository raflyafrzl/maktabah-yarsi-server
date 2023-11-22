import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export default class CreateUserDTO {
  @ApiProperty({
    type: String,
    description: 'username user',
    default: 'maktabahyarsi',
  })
  username: string;
  @ApiProperty({
    type: String,
    description: 'password user',
    default: 'maktabahyarsi123',
  })
  password: string;
  @ApiProperty({
    type: String,
    description: 'email for user',
    default: 'maktabahyarsi@yarsi.ac.id',
  })
  email: string;
}

export class UpdateUserDTO {
  @ApiProperty({
    type: String,
    description: 'username user',
    default: 'maktabahyarsi',
  })
  username: string;
  @ApiProperty({
    type: String,
    description: 'password user',
    default: 'maktabahyarsi123',
  })
  password: string;
  @ApiProperty({
    type: String,
    description: 'email for user',
    default: 'maktabahyarsi@yarsi.ac.id',
  })
  email: string;
  @ApiProperty({
    type: String,
    description: 'old password user',
    default: 'maktabahyarsi123',
  })
  old_password: string;
}

export class AuthLoginDTO {
  @ApiProperty({
    type: String,
    description: 'access token google',
    default: 'aksdasdlaso131hsadklasdklasdhjasdhjkadshjjadkjchashksadsadhj',
  })
  token: string;
  id: string;
}

export class UserAuthGoogleDTO {
  email: string;
  name?: string;
}

export class UserSignInDTO {
  @ApiProperty({
    type: String,
    description: 'username user for login',
    default: 'maktabahyarsi@gmail.com',
  })
  email: string;
  @ApiProperty({
    type: String,
    description: 'password user for login',
    default: 'maktabahyarsi123',
  })
  password: string;

  isUsingGoogle?: boolean;
}

export const validationCreateUser: Joi.ObjectSchema<CreateUserDTO> = Joi.object(
  {
    username: Joi.string().min(5, 'utf-8').required(),
    password: Joi.string().min(5, 'utf-8').required(),
    email: Joi.string().email().required(),
  },
);

export const validationUpdateUser: Joi.ObjectSchema<UpdateUserDTO> = Joi.object(
  {
    username: Joi.string().min(5, 'utf-8'),
    password: Joi.string().min(5, 'utf-8'),
    email: Joi.string().email(),
    old_password: Joi.string().min(5, 'utf-8'),
  },
);

export const validationSignIn: Joi.ObjectSchema<UserSignInDTO> = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  isUsingGoogle: Joi.boolean(),
});
