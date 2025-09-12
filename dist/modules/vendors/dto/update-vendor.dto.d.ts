export declare class StoreSettingsDto {
    logo: string;
    logoUri: string;
    logoHash: string;
    banner: string;
    bannerUri: string;
    bannerHash: string;
    primaryColor: string;
    description?: string;
    socialLinks?: Record<string, string>;
}
export declare class UpdateVendorDto {
    logo: string;
    businessName?: string;
    businessDescription?: string;
    businessAddress?: string;
    storeSettings?: StoreSettingsDto;
    verified?: boolean;
}
