import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import {
  BibliografiCreateDTO,
  QueryFindBibliografi,
} from 'src/dto/bibliografi.dto';
import { CreateOrUpdateCategoryDTO } from 'src/dto/category.dto';
import { CustomClientException } from 'src/exception/custom.exception';
import { Bibliography } from 'src/schemas/bibliografi.schema';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class BibliografiService {
  constructor(
    @InjectModel(Bibliography.name) private bibliografi: Model<Bibliography>,
    private categoryService: CategoryService,
  ) {}

  async find(query: QueryFindBibliografi) {
    let result = this.bibliografi.find().populate('category');
    if (query.title) {
      result = result.find({ title: { $regex: `/${query.title}/` } });
    }

    if (query.sort) {
      const sortBy = query.sort.split(',').join(' ');
      result = result.sort(sortBy);
    }

    return result;
  }

  async create(payload: BibliografiCreateDTO) {
    const result: Category = await this.categoryService.findOne(
      payload.category,
    );
    if (!result)
      throw new CustomClientException('No Category Found', 400, 'BAD_REQUEST');

    const id: string = result['_id'].toString();
    const addTotal: CreateOrUpdateCategoryDTO = {
      total: 1,
    };

    await this.categoryService.updateOne(id, addTotal);

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
