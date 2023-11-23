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
import { JoiValidation } from 'src/pipes/validation.pipe';
import { ListcontentService } from './listcontent.service';
import {
  CreateOrListContentDTO,
  validationCreateListContentDTO,
  validationUpdateListContentDTO,
} from 'src/dto/listcontent.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { ResponseWebSuccess } from 'src/model/response.web';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';
import { ListContent } from 'src/schemas/listcontent.schema';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';

@ApiTags('List Content')
@Controller('api/v1/listcontents')
export class ListcontentController {
  constructor(private listContentService: ListcontentService) {}

  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  @ApiOperation({ summary: 'create list of content' })
  @ApiResponse({
    description: 'data has been successfully created',
    status: 201,
  })
  @ApiResponse({ description: 'invalid payload provided', status: 400 })
  @ApiResponse({ description: 'internal server error ', status: 500 })
  async create(
    @Body(new JoiValidation(validationCreateListContentDTO))
    payload: CreateOrListContentDTO,
  ): Promise<ResponseWebSuccess> {
    const data = await this.listContentService.create(payload);

    return {
      data,
      message: 'List of content successfully created',
      status: 'success',
      statusCode: 201,
    };
  }

  @UseFilters(HttpExceptionFilter)
  @Get('/:id')
  @ApiResponse({
    description: 'success fully retrieved a list of content',
    status: 200,
  })
  @ApiResponse({ description: 'no list of content found', status: 404 })
  @ApiResponse({ description: 'internal server error ', status: 500 })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Find list of content based on bibliography id',
  })
  @ApiOperation({
    summary: 'get a specific the list of content based on the bibliography id',
  })
  async getByBibliographyId(
    @Param('id', new MongoIdValidation()) id: string,
  ): Promise<ResponseWebSuccess> {
    const result: ListContent =
      await this.listContentService.getByBibliographyId(id);

    return {
      status: 'success',
      statusCode: 200,
      data: result,
      message: 'success retrieved list of content',
    };
  }

  @Patch('/:id')
  @UseFilters(MongoExceptionFilter)
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'updated a list of content based on id' })
  @ApiResponse({
    description: 'successfully updated a list of content',
    status: 200,
  })
  @ApiResponse({ description: 'no list of content found', status: 404 })
  @ApiResponse({ description: 'internal server error ', status: 500 })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'updated a list of content based on id',
  })
  async update(
    @Param('id') id: string,
    @Body(new JoiValidation(validationUpdateListContentDTO))
    payload: CreateOrListContentDTO,
  ): Promise<ResponseWebSuccess> {
    const result = await this.listContentService.updateOne(id, payload);

    return {
      data: result,
      message: 'successfully updated a list of content',
      status: 'success',
      statusCode: 200,
    };
  }
  @ApiResponse({
    description: 'successfully deleted a list of content',
    status: 200,
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'deleted a list of content based on id',
  })
  @ApiOperation({ summary: 'deleted based on the list of content id' })
  @ApiResponse({ description: 'no list of content found', status: 404 })
  @ApiResponse({ description: 'internal server error ', status: 500 })
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<ResponseWebSuccess> {
    await this.listContentService.deleteOne(id);

    return {
      data: id,
      message: 'successfully deleted a list of content',
      status: 'success',
      statusCode: 200,
    };
  }
}
