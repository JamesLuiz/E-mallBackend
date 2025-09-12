export declare class SupportQueryDto {
    query: string;
    category?: 'order' | 'payment' | 'shipping' | 'account' | 'vendor' | 'general';
    priority?: 'low' | 'medium' | 'high';
    contactPreference?: 'email' | 'phone' | 'chat';
}
