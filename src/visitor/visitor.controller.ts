import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import * as moment from 'moment';
import { JoiValidation } from 'src/pipes/validation.pipe';
import {
  QueryParamVisitorDTO,
  validationQueryVisitor,
} from 'src/schemas/visitor.schema';
import { VisitorService } from './visitor.service';
import { ResponseWebSuccess } from 'src/model/response.web';

@Controller('api/v1/visitor')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Patch('/')
  async createOrUpdate(): Promise<ResponseWebSuccess> {
    const date = moment().locale('id').toDate();
    const result = await this.visitorService.createOrUpdate(date);

    return {
      data: result,
      message: 'success updated data',
      status: 'success',
      statusCode: 200,
    };
  }

  @Get('/')
  async findByMonth(
    @Query(new JoiValidation(validationQueryVisitor))
    query: QueryParamVisitorDTO,
  ): Promise<ResponseWebSuccess> {
    const result = await this.visitorService.find(query);

    return {
      status: 'success',
      statusCode: 200,
      message: 'success retrieved all visitor by month',
      data: result,
    };
  }
}
