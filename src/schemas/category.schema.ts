import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

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
  @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Category;
}
export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'category',
});
