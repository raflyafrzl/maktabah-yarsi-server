import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateOrUpdateCategoryDTO } from 'src/dto/category.dto';
import { CustomClientException } from 'src/exception/custom.exception';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private category: Model<Category>) {}

  async find() {
    return this.category.find({});
  }

  async findOne(name: string) {
    const result = this.category
      .findOne({ name: name })
      .populate('subcategories');
    return result;
  }

  async create(payload: CreateOrUpdateCategoryDTO) {
    let id: Types.ObjectId;
    if (payload.category) {
      if (mongoose.Types.ObjectId.isValid(payload.category)) {
        id = mongoose.Types.ObjectId.createFromHexString(payload.category);
      }
    }

    const result = this.category.create({
      category: id,
      name: payload.name,
    });
    return await result;
  }
  async update(id: string, payload: CreateOrUpdateCategoryDTO) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new CustomClientException(
        'invalid id provided',
        400,
        'BAD_REQUEST',
      );

    const result: Category = await this.category.findById(id);

    if (!result)
      throw new CustomClientException('no data found', 404, 'NOT_FOUND');

    return this.category
      .updateOne(
        { _id: mongoose.Types.ObjectId.createFromHexString(id) },
        { $set: payload },
        { new: true },
      )
      .lean();
  }
  async delete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new CustomClientException(
        'invalid id provided',
        400,
        'BAD_REQUEST',
      );
    const result: Category = await this.category.findById(id);

    if (!result)
      throw new CustomClientException('no data found', 404, 'NOT_FOUND');

    return this.category.deleteOne({
      _id: mongoose.Types.ObjectId.createFromHexString(id),
    });
  }
}
