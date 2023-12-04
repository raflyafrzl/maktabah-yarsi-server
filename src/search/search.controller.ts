import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { QuerySearch, validationSearchElastic } from 'src/dto/content.dto';
import { JoiValidation } from 'src/pipes/validation.pipe';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
@ApiTags('search')
@Controller('api/v1/search')
export class SearchController {
  constructor(private elasticService: SearchService) {}

  @Post('/')
  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get searched document based on query' })
  @ApiResponse({ status: 200, description: 'success retrieved document' })
  @ApiResponse({ status: 500, description: 'There is an error on server' })
  async search(
    @Body(new JoiValidation(validationSearchElastic)) query: QuerySearch,
  ): Promise<ResponseWebSuccess> {
    const { hits } = await this.elasticService.search(query);
    return {
      data: hits.hits,
      message: 'success retrieved data',
      status: 'success',
      statusCode: 200,
    };
  }
}
