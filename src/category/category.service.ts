import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  CreateOrUpdateCategoryDTO,
  CreateOrUpdateSubCategoryDTO,
  QueryParamCategoryDTO,
} from 'src/dto/category.dto';
import { CustomClientException } from 'src/exception/custom.exception';
import { Category, SubCategory } from 'src/schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private category: Model<Category>,
    @InjectModel(SubCategory.name) private subCategory: Model<SubCategory>,
  ) {}

  async find() {
    const result = this.category.find().populate('subcategories');
    return result;
  }

  async findOne(name: string) {
    const result = this.category.findOne({ name: name });
    return result;
  }

  async create(
    payload: CreateOrUpdateSubCategoryDTO | CreateOrUpdateCategoryDTO,
    query: QueryParamCategoryDTO,
  ) {
    let result: Category | SubCategory;
    if (payload['id'] && query.result === 'sub') {
      const data = await this.category.findById(payload['id']);
      if (!data) {
        throw new CustomClientException('No data found', 400, 'BAD_REQUST');
      }

      result = await this.subCategory.create({
        name: payload.name,
        category: mongoose.Types.ObjectId.createFromHexString(payload['id']),
      });
    } else {
      delete payload['id'];
      result = await this.category.create(payload);
    }
    return result;
  }

  async deleteOne(id: string) {
    const result = this.category.findByIdAndDelete(id);
    return result;
  }

  async updateSubCategory(payload: CreateOrUpdateCategoryDTO) {
    if (payload.total) {
      const data: SubCategory = await this.subCategory.findOne({
        name: payload.name,
      });
      payload.total = data.total + 1;
    }
    const result = this.subCategory.updateOne(
      { name: payload.name },
      { $set: payload },
      {
        new: true,
        runValidators: true,
      },
    );
    return result;
  }

  async updateOne(id: string, payload: CreateOrUpdateCategoryDTO) {
    if (payload.total) {
      const data = await this.category.findById(id);

      if (!data)
        throw new CustomClientException(
          'No category found',
          400,
          'BAD_REQUEST',
        );

      payload.total = data.total + 1;
    }
    const result = this.category.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return result;
  }
  async findSubByCategoryId(id: string) {
    return this.subCategory.find({
      category: mongoose.Types.ObjectId.createFromHexString(id),
    });
  }
  async findOneSubByName(name: string) {
    return this.subCategory.findOne({ name: name });
  }
}
