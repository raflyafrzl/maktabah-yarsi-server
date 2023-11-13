import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserGoogle } from '../schemas/user.schema';
import { Model } from 'mongoose';
import CreateOrUpdateUserDTO, { UserAuthGoogleDTO } from 'src/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { CustomClientException } from 'src/exception/custom.exception';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserGoogle.name) private userAuth: Model<UserGoogle>,
  ) {}

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

  async createOrFindUserGoogle(data: UserAuthGoogleDTO) {
    const result: UserGoogle = await this.userAuth.findOne({
      email: data.email,
    });

    //If user with this auth already registered then do not create the acc
    if (result) return result;

    return this.userAuth.create(data);
  }
}
