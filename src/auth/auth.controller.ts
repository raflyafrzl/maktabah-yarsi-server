import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import CreateOrUpdateUserDTO, {
  UserSignInDTO,
  validationCreateUser,
  validationSignIn,
} from 'src/dto/user.dto';
import { JoiValidation } from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { UserModelResponse } from 'src/model/user.response';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';

@Controller('api/v1/auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body(new JoiValidation(validationSignIn)) payload: UserSignInDTO,
  ): Promise<ResponseWebSuccess> {
    const token = await this.authService.signIn(payload);
    return {
      data: {
        access_token: token,
      },
      message: 'User has been successfully log in',
      statusCode: 200,
      status: 'success',
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/register')
  @UsePipes(new JoiValidation(validationCreateUser))
  @UseFilters(MongoExceptionFilter)
  async register(
    @Body() payload: CreateOrUpdateUserDTO,
  ): Promise<ResponseWebSuccess> {
    const result = await this.authService.register(payload);
    const serializedResponse = new UserModelResponse(result);
    return {
      data: serializedResponse,
      message: 'User has been successfully created',
      status: 'success',
      statusCode: 201,
    };
  }
}
