import { Controller, Get, Param } from '@nestjs/common';
import * as moment from 'moment';
import { JoiValidation } from 'src/pipes/validation.pipe';
import { validationVisitor } from 'src/schemas/visitor.schema';
import { VisitorService } from './visitor.service';
import { ResponseWebSuccess } from 'src/model/response.web';

@Controller('api/v1/visitor')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Get('/')
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

  @Get('/:month')
  async findByMonth(
    @Param('month', new JoiValidation(validationVisitor)) month: string,
  ): Promise<ResponseWebSuccess> {
    const result = await this.visitorService.find(month);
    return {
      status: 'success',
      statusCode: 200,
      message: 'success retrieved all visitor by month',
      data: result,
    };
  }
}
