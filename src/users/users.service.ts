import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import CreateOrUpdateUserDTO from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async create(payload: CreateOrUpdateUserDTO) {
    payload.password = await bcrypt.hash(payload.password, 10);
    return this.userModel.create({
      username: payload.username,
      password: payload.password,
      email: payload.email,
    });
  }

  async update(id: string, payload: CreateOrUpdateUserDTO) {
    const result = this.userModel.updateOne(
      { _id: id },
      { $set: payload },
      { new: true },
    );
    return result;
  }

  async findOneById(id: string) {
    const result = this.userModel.findById(id);
    return result;
  }
}
