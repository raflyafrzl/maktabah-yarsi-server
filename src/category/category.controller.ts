import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { Category, SubCategory } from 'src/schemas/category.schema';
import { JoiValidation } from 'src/pipes/validation.pipe';
import {
  CreateOrUpdateCategoryDTO,
  CreateOrUpdateSubCategoryDTO,
  QueryParamCategoryDTO,
  validationCategoryCreate,
  validationQueryCategory,
  validationUpdateCategory,
} from 'src/dto/category.dto';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomClientException } from 'src/exception/custom.exception';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

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
  async get(): Promise<ResponseWebSuccess> {
    const result: Category[] = await this.categoryService.find();
    return {
      statusCode: 200,
      status: 'success',
      data: result,
      message: 'Data has been successfully retrieved',
    };
  }

  @Get(':name')
  @ApiOperation({ summary: 'find a category base on the name' })
  @ApiResponse({ status: 200, description: 'success retrieved a data' })
  @UseFilters(HttpExceptionFilter)
  async findOne(@Param('name') name: string): Promise<ResponseWebSuccess> {
    const result: Category | undefined = await this.categoryService.findOne(
      name,
    );

    if (!result)
      throw new CustomClientException('No data found', 400, 'DATA_NOT_FOUND');

    return {
      data: result,
      message: 'A category has been successfully retrieved',
      status: 'Success',
      statusCode: 200,
    };
  }

  @Post('/')
  //TODO:uncomment Guards
  // @UseGuards(AuthGuard, AdminGuard)
  @UseFilters(MongoExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({ status: 201, description: 'success create a category' })
  @ApiResponse({ status: 400, description: 'Invalid payload provided' })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
  async create(
    @Body(new JoiValidation(validationCategoryCreate))
    payload: CreateOrUpdateSubCategoryDTO | CreateOrUpdateCategoryDTO,
    @Query(new JoiValidation(validationQueryCategory))
    query: QueryParamCategoryDTO,
  ): Promise<ResponseWebSuccess> {
    await this.categoryService.create(payload, query);

    return {
      data: payload,
      message: 'A category has been successfully created',
      status: 'success',
      statusCode: 201,
    };
  }

  @ApiResponse({ status: 200, description: 'success delete a category' })
  @ApiResponse({ status: 400, description: 'Invalid id provided' })
  @ApiOperation({ summary: 'Delete a category based on the id' })
  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async delete(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    await this.categoryService.deleteOne(id);

    return {
      data: `${id}`,
      message: 'A category has been successfully deleted',
      status: 'success',
      statusCode: 200,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @UseFilters(MongoExceptionFilter)
  @ApiResponse({ status: 200, description: 'success updated a category' })
  @ApiResponse({ status: 400, description: 'Invalid id provided' })
  @ApiOperation({ summary: 'update a category' })
  async update(
    @Param('id', MongoIdValidation) id: string,
    @Body(new JoiValidation(validationUpdateCategory))
    payload: CreateOrUpdateCategoryDTO,
  ): Promise<ResponseWebSuccess> {
    const result = await this.categoryService.updateOne(id, payload);
    return {
      data: result,
      status: 'success',
      statusCode: 200,
      message: 'A category has been succesfully updated',
    };
  }

  @ApiResponse({
    status: 200,
    description: 'success retrieved subcategories by category id',
  })
  @ApiResponse({ status: 404, description: 'subcategories not found' })
  @ApiOperation({ summary: 'retrieved subtegories ' })
  @Get('/sub/:id')
  async getSubById(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result: SubCategory[] =
      await this.categoryService.findSubByCategoryId(id);
    return {
      data: result,
      message: 'A sub category has been succesfully retrieved',
      status: 'success',
      statusCode: 200,
    };
  }
}
