import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ type: Object })
  dashboard?: Record<string, any>;

  @Prop({ type: Object })
  sales?: Record<string, any>;

  @Prop({ type: Object })
  products?: Record<string, any>;

  @Prop({ type: Object })
  customers?: Record<string, any>;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);