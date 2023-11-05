import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BibliografiCreateDTO,
  QueryFindBibliografi,
} from 'src/dto/bibliografi.dto';
import { Bibliography } from 'src/schemas/bibliografi.schema';

@Injectable()
export class BibliografiService {
  constructor(
    @InjectModel(Bibliography.name) private bibliografi: Model<Bibliography>,
  ) {}

  async find(query: QueryFindBibliografi) {
    if (!query.title) return this.bibliografi.find({ title: query.title });
    return this.bibliografi.find();
  }

  async create(payload: BibliografiCreateDTO) {
    this.bibliografi.create(payload);
  }
}
