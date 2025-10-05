import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FollowUserDto } from './dto/follow-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./schemas/user.schema").User[]>;
    getProfile(userId: string): Promise<import("./schemas/user.schema").User>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<import("./schemas/user.schema").User>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<import("./schemas/user.schema").User>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<import("./schemas/user.schema").User>;
    remove(id: string): Promise<void>;
    followUser(userId: string, followDto: FollowUserDto): Promise<{
        message: string;
        follow: import("mongoose").Document<unknown, {}, import("./schemas/follow.schema").FollowDocument> & import("./schemas/follow.schema").Follow & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    unfollowUser(userId: string, followingId: string): Promise<{
        message: string;
    }>;
    getFollowers(userId: string, page?: number, limit?: number): Promise<{
        followers: Omit<import("mongoose").Document<unknown, {}, import("./schemas/follow.schema").FollowDocument> & import("./schemas/follow.schema").Follow & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        totalFollowers: number;
        page: number;
        totalPages: number;
    }>;
    getFollowing(userId: string, page?: number, limit?: number): Promise<{
        following: Omit<import("mongoose").Document<unknown, {}, import("./schemas/follow.schema").FollowDocument> & import("./schemas/follow.schema").Follow & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        totalFollowing: number;
        page: number;
        totalPages: number;
    }>;
    getFollowSuggestions(userId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument> & import("./schemas/user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    isFollowing(followerId: string, followingId: string): Promise<{
        isFollowing: boolean;
    }>;
}
