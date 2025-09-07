import { Document } from 'mongoose';
export type JobDocument = Job & Document;
export declare class Job {
    title: string;
    description: string;
    requirements: string[];
    location: string;
    type: string;
    salary?: string;
}
export declare const JobSchema: import("mongoose").Schema<Job, import("mongoose").Model<Job, any, any, any, Document<unknown, any, Job> & Job & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Job, Document<unknown, {}, import("mongoose").FlatRecord<Job>> & import("mongoose").FlatRecord<Job> & {
    _id: import("mongoose").Types.ObjectId;
}>;
