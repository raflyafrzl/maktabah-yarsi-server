import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { QuerySearch } from 'src/dto/content.dto';

@Injectable()
export class SearchService {
  constructor(private elasticService: ElasticsearchService) {}

  async search(query: QuerySearch) {
    const jsonString = `{
      "query" : {
         "${query.type}": {
           "${query.key}": "${query.value}"
         }
      }
   }`;

    return this.elasticService.search({
      index: query.index,
      body: JSON.parse(jsonString),
    });
  }

  async create<T>(index: string, body: T) {
    return this.elasticService.index({
      index,
      body: body,
    });
  }

  async updateDocument<T>(index: string, payload: T, id: string) {
    return this.elasticService.update({
      index,
      id,
      body: {
        doc: payload,
      },
    });
  }

  async deleteDocument(index: string, id: string) {
    return this.elasticService.delete({
      index,
      id,
    });
  }
}
