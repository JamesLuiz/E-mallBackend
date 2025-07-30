declare class StoreSettingsDto {
    logo?: string;
    banner?: string;
    primaryColor?: string;
    description?: string;
    socialLinks?: Record<string, string>;
}
export declare class CreateVendorDto {
    businessName: string;
    businessDescription?: string;
    businessAddress?: string;
    storeSettings?: StoreSettingsDto;
}
export {};
