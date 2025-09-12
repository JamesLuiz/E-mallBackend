import { Document, Types } from 'mongoose';
export type ChatSessionDocument = ChatSession & Document;
export declare class ChatMessage {
    role: string;
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export declare class ChatSession {
    userId: Types.ObjectId;
    title: string;
    messages: ChatMessage[];
    lastActivity: Date;
    messageCount: number;
    context?: {
        lastIntent?: string;
        preferences?: Record<string, any>;
        searchHistory?: string[];
    };
    isActive: boolean;
}
export declare const ChatSessionSchema: import("mongoose").Schema<ChatSession, import("mongoose").Model<ChatSession, any, any, any, Document<unknown, any, ChatSession> & ChatSession & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatSession, Document<unknown, {}, import("mongoose").FlatRecord<ChatSession>> & import("mongoose").FlatRecord<ChatSession> & {
    _id: Types.ObjectId;
}>;
