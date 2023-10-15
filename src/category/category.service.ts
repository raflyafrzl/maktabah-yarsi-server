import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrUpdateCategoryDTO } from 'src/dto/category.dto';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private category: Model<Category>) {}

  async find() {
    const result = this.category.find();
    return result;
  }
  async create(payload: CreateOrUpdateCategoryDTO) {
    const result = this.category.create(payload);
    return result;
  }

  async deleteOne(id: string) {
    const result = this.category.findByIdAndDelete(id);
    return result;
  }
}
