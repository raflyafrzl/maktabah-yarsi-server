import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BibliografiCreateDTO,
  QueryFindBibliografi,
} from 'src/dto/bibliografi.dto';
import { Bibliography } from 'src/schemas/bibliografi.schema';

@Injectable()
export class BibliografiService {
  constructor(
    @InjectModel(Bibliography.name) private bibliografi: Model<Bibliography>,
  ) {}

  async find(query: QueryFindBibliografi) {
    let result = this.bibliografi.find();
    if (!query.title) {
      result = result.find({ title: { $regex: `/${query.title}/` } });
    }

    if (query.sort) {
      const sortBy = query.sort.split(',').join(' ');
      result = result.sort(sortBy);
    }

    return result;
  }

  async create(payload: BibliografiCreateDTO) {
    this.bibliografi.create(payload);
  }
  async updateViews(id: string) {
    const result = await this.bibliografi.findOne({ _id: id });

    return this.bibliografi.updateOne(
      { _id: result._id },
      { $set: { total: result.total + 1 } },
    );
  }
}
