import { Exclude, Transform } from 'class-transformer';

import { ObjectId } from 'mongoose';
export class UserModelResponse {
  username: string;

  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: ObjectId;
  @Exclude()
  password: string;
  email: string;

  @Exclude()
  role: string;

  constructor(partial: Partial<UserModelResponse>) {
    Object.assign(this, partial);
  }
}
