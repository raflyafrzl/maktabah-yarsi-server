import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateListContentDTO } from 'src/dto/listcontent.dto';
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

  async create(payload: CreateListContentDTO) {
    const result = await this.bibliography.findById(payload.bibliography);

    if (!result) {
      throw new CustomClientException(
        'no bibliography found',
        400,
        'BAD_REQUEST',
      );
    }

    return this.listContent.create({
      page: payload.page,
      bibliography: payload.bibliography,
      name: payload.name,
      sub: payload.sub,
    });
  }

  async getByBibliographyId(id: string) {
    const result = await this.bibliography.findById(id);

    if (!result)
      throw new CustomClientException(
        'No bibliography found',
        400,
        'BAD_REQUEST',
      );

    return this.listContent.findOne({ bibliography: id });
  }
}
