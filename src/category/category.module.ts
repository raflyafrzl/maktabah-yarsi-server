import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  CategorySchema,
  SubCategory,
  SubCategorySchema,
} from 'src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: CategorySchema, name: Category.name },
    ]),
    MongooseModule.forFeature([
      {
        schema: SubCategorySchema,
        name: SubCategory.name,
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
