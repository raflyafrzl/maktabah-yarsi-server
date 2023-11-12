import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category, SubCategory } from './category.schema';
import { HydratedDocument, Types, now } from 'mongoose';

export type BiblioDocument = HydratedDocument<Bibliography>;

@Schema({
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.id;
    },
  },
})
export class Bibliography {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  contributor: string;

  @Prop({ required: true })
  creator: string;

  @Prop()
  publisher: string;

  @Prop({ type: Date, default: Date.now() })
  date_created: Date;

  @Prop()
  source: string;

  @Prop({
    required: true,
    default:
      'https://islandpress.org/sites/default/files/default_book_cover_2015.jpg',
  })
  image_url: string;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  category_id: Category;

  @Prop({ type: Types.ObjectId, ref: SubCategory.name })
  subcategory_id: SubCategory;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 0 })
  page: number;
}

export const BiblioSchema = SchemaFactory.createForClass(Bibliography);
//relationship
BiblioSchema.virtual('category', {
  ref: Category.name,
  localField: 'category_id',
  foreignField: '_id',
});
