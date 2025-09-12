import { BusinessCategory } from '../../../common/enums/business-category.enum';
export declare class RegisterVendorDto {
    businessName: string;
    fullName: string;
    businessPhoneNumber: string;
    businessAddress: string;
    businessCategory: BusinessCategory;
    email: string;
    password: string;
    googleToken?: string;
}
