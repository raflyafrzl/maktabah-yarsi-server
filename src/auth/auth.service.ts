import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateOrUpdateUserDTO, {
  AuthLoginDTO,
  UserSignInDTO,
} from 'src/dto/user.dto';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async signIn(payload: UserSignInDTO): Promise<AuthLoginDTO> {
    const result = await this.userModel.findOne({ email: payload.email });

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
      role: result.role,
    };

    const token = await this.jwtService.signAsync(dataToken);
    return {
      token,
      id: result._id.toString(),
    };
  }

  async register(payload: CreateOrUpdateUserDTO): Promise<User> {
    const result = await this.userService.create(payload);
    return result.toJSON();
  }
}
