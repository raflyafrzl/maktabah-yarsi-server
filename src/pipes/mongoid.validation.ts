import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class MongoIdValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isValid = Types.ObjectId.isValid(value);

    if (!isValid) {
      throw new BadRequestException('Invalid id parameter');
    }
    return value;
  }
}
