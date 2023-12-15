import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BibliografiService } from 'src/bibliografi/bibliografi.service';
import { CreateOrUpdateContentDTO, QuerySearch } from 'src/dto/content.dto';
import { CustomClientException } from 'src/exception/custom.exception';
import { Bibliography } from 'src/schemas/bibliografi.schema';
import { Content } from 'src/schemas/content.schema';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private content: Model<Content>,
    private esService: SearchService,
    private biblioService: BibliografiService,
  ) {}

  async findByBibliographyId(id: string) {
    const result: Content[] = await this.content.find({
      bibliography: mongoose.Types.ObjectId.createFromHexString(id),
    });

    if (!result)
      throw new CustomClientException('no content found', 404, 'NOT_FOUND');

    return result;
  }

  async create(payload: CreateOrUpdateContentDTO) {
    const result: Content = await this.content.findOne({
      bibliography: mongoose.Types.ObjectId.createFromHexString(
        payload.bibliography,
      ),
    });

    if (result)
      throw new CustomClientException(
        'content has already created',
        400,
        'BAD_REQUEST',
      );

    const biblio: Bibliography = await this.biblioService.getById(
      payload.bibliography,
    );

    const data: Content = await this.content.create({
      heading: payload.heading,
      text: payload.text,
      size: payload.size,
      sub: payload.sub,
      bibliography: mongoose.Types.ObjectId.createFromHexString(
        payload.bibliography,
      ),
      page: payload.page,
    });

    payload.bibliography = biblio.title;

    this.esService.create<CreateOrUpdateContentDTO>('contents', payload);

    return data;
  }

  async updateOne(id: string, payload: CreateOrUpdateContentDTO) {
    const result: Content = await this.content.findById(id);

    if (!result)
      throw new CustomClientException('no data found', 404, 'NOT_FOUND');

    const query: QuerySearch = {
      type: 'match_phrase',
      value: result.bibliography.toString(),
      key: 'bibliography',
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
      value: result.bibliography.toString(),
      key: 'bibliography',
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

  async findById(id: string) {
    const result = await this.content.findById(id);

    if (!result) {
      throw new CustomClientException('no content found', 400, 'BAD_REQUEST');
    }

    return result;
  }
}
