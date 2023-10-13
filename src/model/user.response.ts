import { Exclude, Type } from 'class-transformer';

import { Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
export class UserModelResponse {
  @Exclude()
  id: Types.ObjectId;

  username: string;

  password: string;
  email: string;

  @Exclude()
  role: string;

  constructor(partial: Partial<UserModelResponse>) {
    Object.assign(this, partial);
  }
}
