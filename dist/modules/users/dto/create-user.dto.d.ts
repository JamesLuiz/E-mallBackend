import { UserRole } from '../../../common/enums/user-role.enum';
export declare class CreateUserDto {
    email: string;
    password: string;
    roles?: UserRole[];
    firstName?: string;
    lastName?: string;
    phone?: string;
}
