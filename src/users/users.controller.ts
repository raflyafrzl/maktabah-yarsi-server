import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDTO, validationUpdateUser } from '../dto/user.dto';
import { JoiValidation } from 'src/pipes/validation.pipe';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';
import { ResponseWebSuccess } from 'src/model/response.web';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';
import { UserModelResponse } from 'src/model/user.response';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';
import { Request } from 'express';

@Controller('api/v1/users')
@ApiTags('User')
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
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'Get all data of users' })
  @ApiResponse({ status: 200, description: 'Success retrieved data' })
  @ApiResponse({ status: 500, description: 'internal server error' })
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
  @ApiParam({
    name: 'id',
    description: 'parameter id to get specific user',
    examples: {
      'valid example': { value: '652bd4956971572c592f7576' },
      'invalid example': { value: '111111111' },
    },
  })
  @ApiOperation({ summary: 'update data user' })
  @ApiResponse({
    status: 200,
    description: 'Data has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Invalid id provided' })
  @ApiResponse({ status: 500, description: 'There is an error server' })
  @ApiParam({
    description: 'id user',
    name: 'id',
    required: true,
    type: String,
  })
  @UseFilters(MongoExceptionFilter)
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthGuard)
  async update(
    @Body(new JoiValidation(validationUpdateUser))
    payload: UpdateUserDTO,
    @Param('id', MongoIdValidation) id: string,
    @Req() req,
  ): Promise<ResponseWebSuccess> {
    const result = await this.userService.update(
      id,
      payload,
      req['user']['google'],
    );
    return {
      data: result,
      status: 'success',
      message: 'Data has been successfully updated',
      statusCode: 200,
    };
  }
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'parameter id to get specific user',
    examples: {
      'valid example': { value: '652bd4956971572c592f7576' },
      'invalid example': { value: '123474747' },
    },
  })
  @ApiOperation({ summary: 'get specific data user' })
  @ApiResponse({ status: 400, description: 'Invalid id provided' })
  @ApiResponse({ status: 200, description: 'Success retrived a data' })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  async findById(
    @Param('id', MongoIdValidation) id: string,
    @Req() req,
  ): Promise<ResponseWebSuccess> {
    const result = await this.userService.findOneById(
      id,
      req['user']['google'],
    );
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
