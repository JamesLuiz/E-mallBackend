import { Document, Types } from 'mongoose';
export type TicketDocument = Ticket & Document;
export declare class Ticket {
    userId: Types.ObjectId;
    subject: string;
    message: string;
    status: string;
    priority: string;
}
export declare const TicketSchema: import("mongoose").Schema<Ticket, import("mongoose").Model<Ticket, any, any, any, Document<unknown, any, Ticket> & Ticket & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Ticket, Document<unknown, {}, import("mongoose").FlatRecord<Ticket>> & import("mongoose").FlatRecord<Ticket> & {
    _id: Types.ObjectId;
}>;
