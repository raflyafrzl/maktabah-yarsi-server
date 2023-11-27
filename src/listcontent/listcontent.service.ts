import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateOrUpdateCategoryDTO } from 'src/dto/category.dto';
import { CreateOrListContentDTO } from 'src/dto/listcontent.dto';
import { CustomClientException } from 'src/exception/custom.exception';
import { Bibliography } from 'src/schemas/bibliografi.schema';
import { ListContent } from 'src/schemas/listcontent.schema';
// import { CreateListContentDTO } from 'src/dto/listcontent.dto';

@Injectable()
export class ListcontentService {
  constructor(
    @InjectModel(ListContent.name) private listContent: Model<ListContent>,
    @InjectModel(Bibliography.name) private bibliography: Model<Bibliography>,
  ) {}

  async create(payload: CreateOrListContentDTO) {
    if (!mongoose.Types.ObjectId.isValid(payload.bibliography))
      throw new CustomClientException(
        'invalid bibliography id',
        400,
        'BAD_REQUEST',
      );

    const result = await this.bibliography.findById(payload.bibliography);

    if (!result) {
      throw new CustomClientException(
        'no bibliography found',
        400,
        'BAD_REQUEST',
      );
    }

    return await this.listContent.create({
      page: payload.page,
      bibliography: mongoose.Types.ObjectId.createFromHexString(
        payload.bibliography,
      ),
      name: payload.name,
      sub: payload.sub,
    });
  }

  async getByBibliographyId(id: string) {
    const result = await this.bibliography.findById(id);

    if (!result)
      throw new CustomClientException(
        'No bibliography found',
        404,
        'NOT_FOUND',
      );

    return this.listContent.findOne({ bibliography: id });
  }

  async updateOne(id: string, payload: CreateOrListContentDTO) {
    const data: ListContent = await this.listContent.findById(id);

    if (!data)
      throw new CustomClientException(
        'no list of content found',
        404,
        'NOT_FOUND',
      );

    const result = this.listContent
      .updateOne({ _id: id }, { $set: payload }, { new: true })
      .lean();

    return result;
  }

  async deleteOne(id: string) {
    const result = await this.listContent.findById(id);

    if (!result)
      throw new CustomClientException('no list of found', 404, 'NOT_FOUND');

    this.listContent.deleteOne({ _id: id });
  }
}
