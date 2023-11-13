import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { BibliografiService } from './bibliografi.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { JoiValidation } from 'src/pipes/validation.pipe';
import {
  BibliografiCreateOrUpdateDTO,
  QueryFindBibliografi,
  validationCreateBibliografi,
  validationQueryFindBibliografi,
} from 'src/dto/bibliografi.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';

@ApiTags('bibliografi')
@Controller('api/v1/bibliografi')
export class BibliografiController {
  constructor(private biblioService: BibliografiService) {}

  @Get('/')
  @UseFilters(HttpExceptionFilter)
  async get(
    @Query(new JoiValidation(validationQueryFindBibliografi))
    query: QueryFindBibliografi,
  ): Promise<ResponseWebSuccess> {
    const data = await this.biblioService.find(query);
    return {
      status: 'success',
      statusCode: 200,
      data,
      message: 'Data has beeen succesfully retrieved',
    };
  }
  @ApiOperation({ summary: 'Create a bibliografi' })
  @ApiResponse({ status: 201, description: 'success create a bibliografi' })
  @ApiResponse({ status: 400, description: 'Invalid payload provided' })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
  @UseFilters(HttpExceptionFilter)
  @Post('/')
  async create(
    @Body(new JoiValidation(validationCreateBibliografi))
    payload: BibliografiCreateOrUpdateDTO,
  ): Promise<ResponseWebSuccess> {
    await this.biblioService.create(payload);

    return {
      data: payload,
      message: 'Book has been successfully created',
      status: 'success',
      statusCode: 201,
    };
  }

  @Patch('/:id')
  @UseFilters(HttpExceptionFilter)
  @UseFilters(MongoExceptionFilter)
  async updateViews(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result = await this.biblioService.updateViews(id);

    return {
      data: result,
      message: 'success updating a view',
      status: 'success',
      statusCode: 200,
    };
  }
}
