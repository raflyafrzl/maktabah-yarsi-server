import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BibliografiService } from 'src/bibliografi/bibliografi.service';
import {
  ContentSearch,
  CreateOrUpdateContentDTO,
  QueryContent,
  QuerySearch,
} from 'src/dto/content.dto';
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

  async findByBibliographyId(id: string, query: QueryContent) {
    const data: Bibliography = await this.biblioService.getById(id);

    const result: Content[] = await this.content
      .find({
        bibliography: mongoose.Types.ObjectId.createFromHexString(id),
        page: Number(query.page),
      })
      .limit(Number(query.size));

    if (!result)
      throw new CustomClientException('no content found', 404, 'NOT_FOUND');
    await this.biblioService.updateViews(id);
    return result;
  }

  async create(payload: CreateOrUpdateContentDTO) {
    const biblio: Bibliography = await this.biblioService.getById(
      payload.bibliography,
    );
    if (!biblio)
      throw new CustomClientException(
        'bibliography is not found',
        404,
        'BAD_REQUEST',
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

    const dataSearch: ContentSearch = {
      id_content: data['_id'].toString(),
      author: biblio.creator,
      bibliography_title: biblio.title,
      id_bibliography: biblio['_id'].toString(),
      text: data.text,
      page: data.page,
      heading: data.heading,
    };

    this.esService.create<ContentSearch>('contents', dataSearch);

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
    await this.biblioService.updateViews(id);
    return result;
  }
}
