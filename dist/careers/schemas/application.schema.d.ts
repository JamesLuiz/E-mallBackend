import { Document, Types } from 'mongoose';
export type ApplicationDocument = Application & Document;
export declare class Application {
    jobId: Types.ObjectId;
    applicantId: Types.ObjectId;
    coverLetter: string;
    resume: string;
}
export declare const ApplicationSchema: import("mongoose").Schema<Application, import("mongoose").Model<Application, any, any, any, Document<unknown, any, Application> & Application & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Application, Document<unknown, {}, import("mongoose").FlatRecord<Application>> & import("mongoose").FlatRecord<Application> & {
    _id: Types.ObjectId;
}>;
