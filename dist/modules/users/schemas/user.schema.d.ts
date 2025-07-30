import { Document } from 'mongoose';
import { UserRole } from '../../../common/enums/user-role.enum';
export type UserDocument = User & Document;
export declare class Profile {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    avatar: string;
}
export declare class User {
    email: string;
    password: string;
    role: UserRole;
    profile: Profile;
    isActive: boolean;
    emailVerified: boolean;
    refreshToken?: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
