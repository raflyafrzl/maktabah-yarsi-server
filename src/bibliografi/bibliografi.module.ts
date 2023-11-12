import { Module } from '@nestjs/common';
import { BibliografiController } from './bibliografi.controller';
import { BibliografiService } from './bibliografi.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BiblioSchema, Bibliography } from 'src/schemas/bibliografi.schema';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bibliography.name, schema: BiblioSchema },
    ]),
    CategoryModule,
  ],
  controllers: [BibliografiController],
  providers: [BibliografiService],
})
export class BibliografiModule {}
