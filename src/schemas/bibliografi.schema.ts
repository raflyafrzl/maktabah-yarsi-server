import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category, SubCategory } from './category.schema';
import { HydratedDocument, Types } from 'mongoose';

export type BiblioDocument = HydratedDocument<Bibliography>;

@Schema()
export class Bibliography {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  contributor: string;

  @Prop()
  creator: string;

  @Prop()
  publisher: string;

  @Prop({ type: Date, default: Date.now() })
  date_created: Date;

  @Prop()
  source: string;

  @Prop()
  image_url: string;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  category_id: Category;

  @Prop({ type: Types.ObjectId, ref: SubCategory.name })
  subcategory_id: SubCategory;
}

export const BiblioSchema = SchemaFactory.createForClass(Bibliography);
