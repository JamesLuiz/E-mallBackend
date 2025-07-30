import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./schemas/user.schema").User[]>;
    getProfile(userId: string): Promise<import("./schemas/user.schema").User>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<import("./schemas/user.schema").User>;
    findOne(id: string): Promise<import("./schemas/user.schema").User>;
    remove(id: string): Promise<void>;
}
