import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateOrUpdateContentDTO } from 'src/dto/content.dto';
import { CustomClientException } from 'src/exception/custom.exception';
import { Content } from 'src/schemas/content.schema';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private content: Model<Content>,
    private esService: SearchService,
  ) {}

  async findByListContentId(id: string) {
    const result = await this.content.findOne({
      listcontent: mongoose.Types.ObjectId.createFromHexString(id),
    });

    if (!result)
      throw new CustomClientException('no content found', 404, 'NOT_FOUND');

    return result;
  }

  async create(payload: CreateOrUpdateContentDTO) {
    const result: Content = await this.content.findOne({
      listcontent: mongoose.Types.ObjectId.createFromHexString(
        payload.listcontent,
      ),
    });

    if (result)
      throw new CustomClientException(
        'content has already created',
        400,
        'BAD_REQUEST',
      );

    this.esService.create<CreateOrUpdateContentDTO>('contents', payload);

    return this.content.create({
      heading: payload.heading,
      text: payload.text,
      listcontent: mongoose.Types.ObjectId.createFromHexString(
        payload.listcontent,
      ),
      page: payload.page,
    });
  }
}
