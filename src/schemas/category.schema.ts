import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;
export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ versionKey: false })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true, default: 0, type: Number })
  total: number;
}

@Schema({ versionKey: false })
export class SubCategory {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Category;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
