import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Inventory {
  @Prop({ required: true })
  stock: number;

  @Prop({ default: 10 })
  lowStockAlert: number;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  subcategory: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Inventory, required: true })
  inventory: Inventory;

  @Prop({ type: Object })
  specifications: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  seoTitle: string;

  @Prop()
  seoDescription: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  ratings: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);