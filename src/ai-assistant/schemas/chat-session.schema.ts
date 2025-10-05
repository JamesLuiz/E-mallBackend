import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatSessionDocument = ChatSession & Document;

@Schema()
export class ChatMessage {
  @Prop({ required: true, enum: ['user', 'assistant'] })
  role: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

@Schema({ timestamps: true })
export class ChatSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [ChatMessage], default: [] })
  messages: ChatMessage[];

  @Prop({ default: Date.now })
  lastActivity: Date;

  @Prop({ default: 0 })
  messageCount: number;

  @Prop({ type: Object })
  context?: {
    lastIntent?: string;
    preferences?: Record<string, any>;
    searchHistory?: string[];
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);