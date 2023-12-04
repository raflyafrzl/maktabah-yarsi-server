import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateOrUpdateContentDTO, QuerySearch } from 'src/dto/content.dto';
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

  async updateOne(id: string, payload: CreateOrUpdateContentDTO) {
    const result: Content = await this.content.findById(id);

    if (!result)
      throw new CustomClientException('no data found', 404, 'NOT_FOUND');

    const query: QuerySearch = {
      type: 'match_phrase',
      value: result.listcontent.toString(),
      key: 'listcontent',
      index: 'contents',
      wild_card: false,
    };

    const { hits } = await this.esService.search(query);

    const idDocument = hits.hits[0]['_id'];

    await this.esService.updateDocument<CreateOrUpdateContentDTO>(
      query.index,
      payload,
      idDocument,
    );

    return this.content
      .updateOne(
        {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
        {
          $set: payload,
        },
        {
          new: true,
        },
      )
      .lean();
  }

  async deleteOne(id: string) {
    const result: Content = await this.content.findById(id);

    if (!result)
      throw new CustomClientException('no data found', 404, 'NOT_FOUND');

    const query: QuerySearch = {
      type: 'match_phrase',
      value: result.listcontent.toString(),
      key: 'listcontent',
      index: 'contents',
      wild_card: false,
    };
    const { hits } = await this.esService.search(query);

    const idDocument = hits.hits[0]['_id'];

    await this.esService.deleteDocument('contents', idDocument);

    this.content.deleteOne({
      _id: mongoose.Types.ObjectId.createFromHexString(id),
    });
  }
}
