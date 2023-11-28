import {
  Body,
  Controller,
  Delete,
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
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { MongoExceptionFilter } from 'src/exception/mongo-exception.filter';
import { MongoIdValidation } from 'src/pipes/mongoid.validation';
import { Bibliography } from 'src/schemas/bibliografi.schema';

@ApiTags('bibliografi')
@Controller('api/v1/bibliografi')
export class BibliografiController {
  constructor(private biblioService: BibliografiService) {}

  @Get('/')
  @UseFilters(HttpExceptionFilter)
  @ApiQuery({ type: QueryFindBibliografi, required: false })
  @ApiOperation({ summary: 'get all/specific bibliografi based on query' })
  @ApiResponse({ status: 201, description: 'success retrieved a bibliografi' })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
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

  @Get('/:id')
  @UseFilters(HttpExceptionFilter)
  async getById(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result: Bibliography = await this.biblioService.findById(id);

    return {
      data: result,
      message: 'successfully retrived a bibliography',
      status: 'success',
      statusCode: 200,
    };
  }
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @ApiOperation({ summary: 'Create a bibliografi' })
  @ApiResponse({ status: 201, description: 'success create a bibliografi' })
  @ApiResponse({ status: 400, description: 'Invalid payload provided' })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
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
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @ApiOperation({ summary: 'update total view bibliography' })
  @ApiResponse({
    status: 200,
    description: 'successfully updated bibliography view',
  })
  @ApiResponse({ status: 500, description: 'internal server error' })
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

  @Delete('/:id')
  @UseFilters(HttpExceptionFilter)
  @UseFilters(MongoExceptionFilter)
  @ApiParam({
    name: 'id',
    description: 'id of bibliography',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'deleted bibliography based on the id' })
  async delete(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    await this.biblioService.deleteOne(id);

    return {
      data: id,
      message: 'successfully deleted a bibliography',
      status: 'success',
      statusCode: 200,
    };
  }
  @Get('categories/:id')
  @UseFilters(HttpExceptionFilter)
  async getByCategoryId(
    @Param('id', MongoIdValidation) id: string,
  ): Promise<ResponseWebSuccess> {
    const result: Bibliography[] = await this.biblioService.findByCategoryId(
      id,
    );

    return {
      data: result,
      message: 'successfully retrived a bibliography',
      status: 'success',
      statusCode: 200,
    };
  }
}
