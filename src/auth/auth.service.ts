import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateOrUpdateUserDTO, {
  AuthLoginDTO,
  UserAuthGoogleDTO,
  UserSignInDTO,
} from 'src/dto/user.dto';
import { User, UserGoogle } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { getToken } from 'src/utils/validate.token';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async signIn(payload: UserSignInDTO): Promise<AuthLoginDTO> {
    let result: User | UserGoogle =
      await this.userService.createOrFindUserGoogle({
        email: payload.email,
      });
    if (!payload.isUsingGoogle) {
      result = await this.userModel.findOne({ email: payload.email });

      if (!result)
        throw new BadRequestException('Invalid username or password');
      const isMatchPassword = await bcrypt.compare(
        payload.password,
        (result as User).password,
      );

      if (!isMatchPassword) {
        throw new BadRequestException('Invalid username or password');
      }
    }

    const dataToken = {
      id: result['_id'].toString(),
      username: result.username,
      role: result.role,
    };

    const token = await this.jwtService.signAsync(dataToken);
    return {
      token,
      id: dataToken.id,
    };
  }

  async register(payload: CreateOrUpdateUserDTO): Promise<User> {
    const result = await this.userService.create(payload);
    return result.toJSON();
  }

  async findOrSave(token: string) {
    const { data } = await getToken(token);

    const payload: UserAuthGoogleDTO = {
      name: data['name'],
      email: data['email'],
    };

    const result = await this.userService.createOrFindUserGoogle(payload);

    return result;
  }
}
