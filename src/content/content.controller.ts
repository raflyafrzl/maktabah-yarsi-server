import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
} from 'src/dto/content.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';

@ApiTags('contents')
@Controller('api/v1/contents')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('/:id')
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'get a content by listcontent id' })
  @ApiResponse({ status: 200, description: 'success retrieved a content' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 400, description: 'invalid id provided' })
  @ApiResponse({ status: 404, description: 'no data found' })
  async getByListContentId(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result = await this.contentService.findByListContentId(id);

    return {
      message: 'success retrieved contens',
      data: result,
      status: 'success',
      statusCode: 200,
    };
  }

  @Post('/')
  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'create a content ' })
  @ApiResponse({ status: 200, description: 'success created a content' })
  @ApiResponse({ status: 500, description: 'internal server error' })
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
}
