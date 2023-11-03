import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model } from 'mongoose';
import { Visitor } from 'src/schemas/visitor.schema';

@Injectable()
export class VisitorService {
  constructor(@InjectModel(Visitor.name) private visitor: Model<Visitor>) {}

  async find(month: string) {
    return this.visitor.find({ month: month });
  }

  async createOrUpdate(date: Date) {
    const monthString = moment().month(date.getMonth()).format('MMMM');
    const result = await this.visitor.find({
      month: monthString,
      year: date.getFullYear(),
    });

    if (!result) {
      this.visitor.create({
        total: 1,
        month: monthString,
        year: date.getFullYear(),
      });
      return;
    }
  }
}
