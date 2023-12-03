import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { ResponseWebSuccess } from 'src/model/response.web';

@Controller('api/v1/search')
export class SearchController {
  constructor(private elasticService: SearchService) {}

  @Post('/')
  async search(@Body() query: any): Promise<ResponseWebSuccess> {
    const result = await this.elasticService.search('contents', query);
    return {
      data: result,
      message: 'success retrieved data',
      status: 'success',
      statusCode: 200,
    };
  }
}
