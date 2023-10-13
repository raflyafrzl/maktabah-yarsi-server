import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import CreateOrUpdateUserDTO, { validationUpdateUser } from '../dto/user.dto';
import { JoiValidation } from 'src/pipes/validation.pipe';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';
import { ResponseWebSuccess } from 'src/model/response.web';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';

@Controller('api/v1/users')
export class UsersController {
  constructor(private userService: UsersService) {}

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
}
