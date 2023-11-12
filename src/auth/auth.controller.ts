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
  AuthLoginDTO,
  UserSignInDTO,
  validationCreateUser,
  validationSignIn,
} from 'src/dto/user.dto';
import { JoiValidation } from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { UserModelResponse } from 'src/model/user.response';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';

@Controller('api/v1/auth')
@ApiTags('Auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'to get data user' })
  @ApiResponse({ status: 200, description: 'token has been created' })
  @ApiResponse({ status: 400, description: 'invalid username or password' })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
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

  @Post('/loginauth')
  @UseFilters(HttpExceptionFilter)
  async loginWithAuth(
    @Body() token: AuthLoginDTO,
  ): Promise<ResponseWebSuccess> {
    const result = await this.authService.findOrSave(token.token);
    return {
      statusCode: 201,
      status: 'success',
      data: 'test',
      message: 'you have successfully login with google',
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/register')
  @ApiOperation({ summary: 'to register user' })
  @ApiResponse({ status: 201, description: 'success registered data' })
  @ApiResponse({ status: 400, description: 'invalid payload provided' })
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
