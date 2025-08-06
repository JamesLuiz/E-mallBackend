import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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
}
