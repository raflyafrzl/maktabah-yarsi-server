import { Body, Controller, Post } from '@nestjs/common';
import { UserSignInDTO, validationSignIn } from 'src/dto/user.dto';
import { JoiValidation } from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { ResponseWebSuccess } from 'src/model/response.web';

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
}
