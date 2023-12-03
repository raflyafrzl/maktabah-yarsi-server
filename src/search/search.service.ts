import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private elasticService: ElasticsearchService) {}

  async search(index: string, query: any) {
    return this.elasticService.search({
      index,
      body: {
        query,
      },
    });
  }

  async create<T>(index: string, body: T) {
    return this.elasticService.index({
      index,
      body: body,
    });
  }
}
