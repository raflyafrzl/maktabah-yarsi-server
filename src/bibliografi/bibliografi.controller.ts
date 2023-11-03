import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BibliografiService } from './bibliografi.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { JoiValidation } from 'src/pipes/validation.pipe';
import {
  BibliografiCreateDTO,
  QueryFindBibliografi,
  validationCreateBibliografi,
  validationQueryFindBibliografi,
} from 'src/dto/bibliografi.dto';

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
