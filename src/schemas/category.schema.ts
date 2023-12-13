import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;
export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.id;
    },
  },
})
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

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: false })
  category: Category;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual('subcategories', {
  ref: 'SubCategory',
  localField: '_id',
  foreignField: 'category',
});
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
