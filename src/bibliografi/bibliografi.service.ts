import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import {
  BibliografiCreateOrUpdateDTO,
  QueryFindBibliografi,
} from 'src/dto/bibliografi.dto';
import { CreateOrUpdateCategoryDTO } from 'src/dto/category.dto';
import { CustomClientException } from 'src/exception/custom.exception';
import { Bibliography } from 'src/schemas/bibliografi.schema';
import { Category, SubCategory } from 'src/schemas/category.schema';

@Injectable()
export class BibliografiService {
  constructor(
    @InjectModel(Bibliography.name) private bibliografi: Model<Bibliography>,
    private categoryService: CategoryService,
  ) {}

  async find(query: QueryFindBibliografi) {
    let result = this.bibliografi.find().populate('category');
    if (query.id) {
      result = result.find({
        _id: mongoose.Types.ObjectId.createFromHexString(query.id),
      });
      return result;
    }

    if (query.sort) {
      const sortBy = query.sort.split(',').join(' ');
      result = result.sort(sortBy).limit(7).skip(0);
    }

    if (query.category) {
      result = result.find({ category_id: query.category });
      return result;
    }

    if (query.sub_category) {
      result = result.find({ subcategory_id: query.sub_category });
      return result;
    }

    return result;
  }

  async create(payload: BibliografiCreateOrUpdateDTO) {
    const result: Category = await this.categoryService.findOne(
      payload.category,
    );
    if (!result)
      throw new CustomClientException('No Category Found', 400, 'BAD_REQUEST');

    const id: string = result['_id'].toString();
    const categoryUpdate: CreateOrUpdateCategoryDTO = {
      total: 1,
      name: result.name,
    };

    this.categoryService.updateOne(id, categoryUpdate);

    const resultSub: SubCategory = await this.categoryService.findOneSubByName(
      payload.subcategory,
    );

    if (!resultSub)
      throw new CustomClientException('No Category Found', 400, 'BAD_REQUEST');

    this.categoryService.updateSubCategory({
      name: resultSub.name,
      total: 1,
    });
    this.bibliografi.create({
      title: payload.title,
      contributor: payload.contributor,
      source: payload.source,
      category_id: id,
      subcategory_id: payload.subcategory,
      image_url: payload.image_url,
      description: payload.description,
      publisher: payload.publisher,
      creator: payload.creator,
      page: payload.page,
    });
  }
  async updateViews(id: string) {
    const result = await this.bibliografi.findOne({ _id: id });

    return this.bibliografi.updateOne(
      { _id: result._id },
      { $set: { total: result.total + 1 } },
    );
  }
}
