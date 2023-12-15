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
  UseFilters,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';
import { ResponseWebSuccess } from 'src/model/response.web';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiValidation } from 'src/pipes/validation.pipe';
import {
  CreateOrUpdateContentDTO,
  validationCreateContent,
  validationUpdateContent,
} from 'src/dto/content.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';
import { Content } from 'src/schemas/content.schema';

@ApiTags('contents')
@Controller('api/v1/contents')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('/:id')
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @ApiOperation({ summary: 'get a content by listcontent id' })
  @ApiResponse({ status: 200, description: 'success retrieved a content' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 400, description: 'invalid id provided' })
  @ApiResponse({ status: 404, description: 'no data found' })
  async getById(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result: Content = await this.contentService.findById(id);

    return {
      message: 'success retrieved contens',
      data: result,
      status: 'success',
      statusCode: 200,
    };
  }

  @Get('bibliography/:id')
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @ApiOperation({ summary: 'get a content by listcontent id' })
  @ApiResponse({ status: 200, description: 'success retrieved a content' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 400, description: 'invalid id provided' })
  @ApiResponse({ status: 404, description: 'no data found' })
  async getByListContentId(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result = await this.contentService.findByBibliographyId(id);

    return {
      message: 'success retrieved contens',
      data: result,
      status: 'success',
      statusCode: 200,
    };
  }

  @Post('/')
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'create a content ' })
  @ApiResponse({ status: 200, description: 'success created a content' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 400, description: 'invalid payload provided' })
  @ApiResponse({
    status: 400,
    description: 'bad request while creating a content',
  })
  async create(
    @Body(new JoiValidation(validationCreateContent))
    payload: CreateOrUpdateContentDTO,
  ): Promise<ResponseWebSuccess> {
    await this.contentService.create(payload);

    return {
      data: payload,
      status: 'success',
      statusCode: 201,
      message: 'success created a content',
    };
  }
  @Patch('/:id')
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update a content ' })
  @ApiResponse({ status: 200, description: 'success update a content' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 400, description: 'invalid payload provided' })
  @ApiResponse({ status: 404, description: 'no data found' })
  async update(
    @Param('id', MongoIdValidation) id: string,
    @Body(new JoiValidation(validationUpdateContent))
    payload: CreateOrUpdateContentDTO,
  ): Promise<ResponseWebSuccess> {
    const result = await this.contentService.updateOne(id, payload);

    return {
      data: result,
      message: 'successfully updated content',
      status: 'success',
      statusCode: 200,
    };
  }
  @Delete('/:id')
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete a content ' })
  @ApiResponse({ status: 200, description: 'success delete a content' })
  @ApiResponse({ status: 404, description: 'no data found' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  async delete(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result = await this.contentService.deleteOne(id);

    return {
      data: result,
      message: 'successfully delete a content',
      status: 'success',
      statusCode: 200,
    };
  }
}
