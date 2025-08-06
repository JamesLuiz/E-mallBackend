import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  requirements: string[];

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  salary?: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);