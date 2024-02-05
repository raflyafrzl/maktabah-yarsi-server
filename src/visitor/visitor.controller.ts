import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import * as moment from 'moment';
import { JoiValidation } from 'src/pipes/validation.pipe';
import {
  QueryParamVisitorDTO,
  validationQueryVisitor,
} from 'src/schemas/visitor.schema';
import { VisitorService } from './visitor.service';
import { ResponseWebSuccess } from 'src/model/response.web';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Visitor')
@Controller('api/v1/visitor')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @ApiResponse({ status: 200, description: 'success created or updated data' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiOperation({ summary: 'to update or created visitor' })
  @Patch('/')
  async createOrUpdate(): Promise<ResponseWebSuccess> {
    const date = moment().locale('id').toDate();
    const result = await this.visitorService.createOrUpdate(date);

    return {
      data: result,
      message: 'success created/updated data',
      status: 'success',
      statusCode: 200,
    };
  }

  @ApiOperation({ summary: 'find visitor by month' })
  @ApiResponse({ status: 200, description: 'retrieved visitor per month' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @Get('/')
  async findByMonth(
    @Query()
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
