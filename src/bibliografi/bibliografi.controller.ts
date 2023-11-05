import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BibliografiService } from './bibliografi.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { JoiValidation } from 'src/pipes/validation.pipe';
import {
  BibliografiCreateDTO,
  QueryFindBibliografi,
  validationCreateBibliografi,
  validationQueryFindBibliografi,
} from 'src/dto/bibliografi.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('bibliografi')
@Controller('api/v1/bibliografi')
export class BibliografiController {
  constructor(private biblioService: BibliografiService) {}

  @Get('/')
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
  @Post('/')
  async create(
    @Body(new JoiValidation(validationCreateBibliografi))
    payload: BibliografiCreateDTO,
  ): Promise<ResponseWebSuccess> {
    await this.biblioService.create(payload);

    return {
      data: payload,
      message: 'Book has been successfully created',
      status: 'success',
      statusCode: 201,
    };
  }
}
