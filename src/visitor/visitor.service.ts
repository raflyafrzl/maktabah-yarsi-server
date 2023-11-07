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
    const monthString: string = moment().month(date.getMonth()).format('MMMM');
    const rangeDate: number = date.getDate();
    let actualRange = 1;
    if (rangeDate >= 1 && rangeDate <= 5) {
      actualRange = 1;
    } else if (rangeDate >= 6 && rangeDate <= 10) {
      actualRange = 2;
    } else if (rangeDate >= 11 && rangeDate <= 15) {
      actualRange = 3;
    } else if (rangeDate >= 16 && rangeDate <= 20) {
      actualRange = 4;
    } else if (rangeDate >= 21 && rangeDate <= 25) {
      actualRange = 5;
    } else {
      actualRange = 6;
    }
    const result = await this.visitor.findOne({
      month: monthString,
      year: date.getFullYear(),
      range: actualRange,
    });

    if (!result) {
      return this.visitor.create({
        range: actualRange,
        total: 1,
        month: monthString,
        year: date.getFullYear(),
      });
    }

    return this.visitor.updateOne(
      {
        month: monthString,
        year: date.getFullYear(),
        range: actualRange,
      },
      {
        $set: {
          total: result.total + 1,
        },
      },
      {
        new: true,
      },
    );
  }
}
