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
import { JoiValidation } from 'src/pipes/validation.pipe';
import { ListcontentService } from './listcontent.service';
import {
  CreateListContentDTO,
  validationCreateListContentDTO,
} from 'src/dto/listcontent.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { ResponseWebSuccess } from 'src/model/response.web';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';
import { ListContent } from 'src/schemas/listcontent.schema';

@Controller('api/v1/listcontents')
export class ListcontentController {
  constructor(private listContentService: ListcontentService) {}

  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async create(
    @Body(new JoiValidation(validationCreateListContentDTO))
    payload: CreateListContentDTO,
  ): Promise<ResponseWebSuccess> {
    const data = await this.listContentService.create(payload);

    return {
      data,
      message: 'List of content successfully created',
      status: 'success',
      statusCode: 201,
    };
  }

  @Get('/:id')
  async getByBibliographyId(
    @Param(new MongoIdValidation()) id: string,
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
}
