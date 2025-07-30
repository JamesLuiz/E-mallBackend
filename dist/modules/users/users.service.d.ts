import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<UserDocument>;
    findOneDocument(id: string): Promise<UserDocument>;
    updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    remove(id: string): Promise<void>;
}
