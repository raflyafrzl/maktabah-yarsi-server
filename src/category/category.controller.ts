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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('api/v1/category')
@ApiTags('Category')
@ApiBearerAuth('access-token')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'get all of category' })
  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Category has been retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
  async getAll(): Promise<ResponseWebSuccess> {
    const result: Category[] = await this.categoryService.find();
    return {
      statusCode: 200,
      status: 'success',
      data: result,
      message: 'Data has been successfully retrieved',
    };
  }
  @ApiOperation({ summary: 'Create a category' })
  @Post('/')
  @UseFilters(MongoExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'success create a category' })
  @ApiResponse({ status: 400, description: 'Invalid payload provided' })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
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

  @ApiResponse({ status: 200, description: 'success delete a category' })
  @ApiResponse({ status: 400, description: 'Invalid id provided' })
  @ApiOperation({ summary: 'Delete a category based on the id' })
  @Delete(':id')
  async delete(
    @Param('id', MongoIdValidation) id: string,
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
