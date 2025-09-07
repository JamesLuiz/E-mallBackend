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

@Schema()
export class ProductImage {
  @Prop({ required: true })
  uri: string;

  @Prop({ required: true })
  hash: string;

  @Prop()
  originalName: string;

  @Prop({ default: false })
  isPrimary: boolean;

  @Prop({ default: Date.now })
  uploadedAt: Date;
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

  @Prop({ type: [ProductImage], default: [] })
  imageUris: ProductImage[];

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
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  sales: number;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ enum: ['draft', 'active', 'inactive', 'out_of_stock'], default: 'active' })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);