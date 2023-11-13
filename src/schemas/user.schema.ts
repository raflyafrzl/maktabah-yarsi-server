import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type UserGoogleDocument = HydratedDocument<UserGoogle>;
@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, default: 'user' })
  role: string;
}

@Schema({ versionKey: false })
export class UserGoogle {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, default: 'user' })
  role: string;
}

export const UserGoogleSchema = SchemaFactory.createForClass(UserGoogle);
export const UserSchema = SchemaFactory.createForClass(User);
