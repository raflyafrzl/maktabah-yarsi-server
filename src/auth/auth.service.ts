import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSignInDTO } from 'src/dto/user.dto';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(payload: UserSignInDTO) {
    const result = await this.userModel.findOne({ username: payload.username });

    if (!result) throw new BadRequestException('Invalid username or password');

    const isMatchPassword = await bcrypt.compare(
      payload.password,
      result.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException('Invalid username or password');
    }

    const dataToken = {
      id: result._id,
      username: result.username,
      email: result.email,
    };

    return await this.jwtService.signAsync(dataToken);
  }
}
