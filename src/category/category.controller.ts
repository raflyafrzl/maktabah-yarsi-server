import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { Category } from 'src/schemas/category.schema';
import { JoiValidation } from 'src/pipes/validation.pipe';
import {
  CreateOrUpdateCategoryDTO,
  validationCategoryCreate,
} from 'src/dto/category.dto';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';

@Controller('api/v1/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  async getAll(): Promise<ResponseWebSuccess> {
    const result: Category[] = await this.categoryService.find();
    return {
      statusCode: 200,
      status: 'success',
      data: result,
      message: 'Data has been successfully retrieved',
    };
  }

  @Post('/')
  @UseFilters(MongoExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new JoiValidation(validationCategoryCreate))
    payload: CreateOrUpdateCategoryDTO,
  ): Promise<ResponseWebSuccess> {
    const result = await this.categoryService.create(payload);

    return {
      data: result,
      message: 'Data has been successfully created',
      status: 'success',
      statusCode: 201,
    };
  }

  @Delete(':id')
  async delete(
    @Param(new MongoIdValidation()) id: string,
  ): Promise<ResponseWebSuccess> {
    await this.categoryService.deleteOne(id);

    return {
      data: `${id}`,
      message: 'Category has been successfully deleted',
      status: 'failed',
      statusCode: 200,
    };
  }
}
