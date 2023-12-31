import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserGoogle } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDTO, UserAuthGoogleDTO } from 'src/dto/user.dto';
import CreateUserDTO from 'src/dto/user.dto';
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

  async create(payload: CreateUserDTO) {
    payload.password = await bcrypt.hash(payload.password, 10);
    return this.userModel.create({
      username: payload.username,
      password: payload.password,
      email: payload.email,
    });
  }

  async update(id: string, payload: UpdateUserDTO, google: boolean) {
    if (google) {
      const result: UserGoogle = await this.userAuth.findById(id);

      if (!result)
        throw new CustomClientException('no data found', 400, 'BAD_REQUEST');

      return this.userAuth.updateOne(
        { _id: id },
        { $set: payload },
        { new: true },
      );
    }
    const result: User = await this.userModel.findById(id);

    if (!result)
      throw new CustomClientException('No data found', 400, 'BAD_REQUEST');
    if (payload.old_password) {
      const isMatch: boolean = await bcrypt.compare(
        payload.old_password,
        result.password,
      );

      if (!isMatch)
        throw new CustomClientException(
          'Invalid old password',
          400,
          'BAD_REQUEST',
        );

      payload.password = await bcrypt.hash(payload.password, 10);
    }

    return this.userModel
      .updateOne({ _id: id }, { $set: payload }, { new: true })
      .lean();
  }

  async findOneById(id: string, isGoogleLogin: boolean) {
    if (isGoogleLogin) {
      return this.userAuth.findById(id);
    }
    return this.userModel.findById(id);
  }

  async createOrFindUserGoogle(data: UserAuthGoogleDTO) {
    const result: UserGoogle = await this.userAuth.findOne({
      email: data.email,
    });

    //If user with this auth already registered then do not create the acc
    if (result) return result;

    return this.userAuth.create({ username: data.name, email: data.email });
  }
}
