import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import CreateOrUpdateUserDTO, { validationUpdateUser } from '../dto/user.dto';
import { JoiValidation } from 'src/pipes/validation.pipe';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';
import { ResponseWebSuccess } from 'src/model/response.web';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';
import { UserModelResponse } from 'src/model/user.response';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('api/v1/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /**
   * @method GET
   * @endpoint /api/v1/users
   * @access Private
   * @returns Object Response
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Get('/')
  async find(): Promise<ResponseWebSuccess> {
    const result: User[] = await this.userService.findAll();
    return {
      data: result,
      status: 'success',
      statusCode: 200,
      message: 'Success retrieved data',
    };
  }

  @Patch(':id')
  async update(
    @Body(new JoiValidation(validationUpdateUser))
    payload: CreateOrUpdateUserDTO,
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result = await this.userService.update(id, payload);
    return {
      data: result,
      status: 'success',
      message: 'Data has been successfully updated',
      statusCode: 200,
    };
  }
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findById(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result = await this.userService.findOneById(id);
    if (!result) {
      throw new NotFoundException('No data found');
    }
    const data = new UserModelResponse(result.toJSON());
    return {
      data: data,
      message: 'A data has been successfully retrieved',
      statusCode: 200,
      status: 'success',
    };
  }
}
