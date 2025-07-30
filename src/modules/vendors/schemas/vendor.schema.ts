import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema()
export class StoreSettings {
  @Prop()
  logo: string;

  @Prop()
  banner: string;

  @Prop({ default: '#40F99B' })
  primaryColor: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  socialLinks: Record<string, string>;
}

@Schema()
export class Subscription {
  @Prop({ default: 'basic' })
  plan: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: Date.now })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: 10000 })
  amount: number;
}

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  businessName: string;

  @Prop()
  businessDescription: string;

  @Prop()
  businessAddress: string;

  @Prop({ type: StoreSettings })
  storeSettings: StoreSettings;

  @Prop({ type: Subscription })
  subscription: Subscription;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  totalSales: number;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);