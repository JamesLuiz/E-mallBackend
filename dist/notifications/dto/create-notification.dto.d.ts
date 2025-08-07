export declare class CreateNotificationDto {
    userId: string;
    title: string;
    message: string;
    type: string;
    read?: boolean;
    data?: Record<string, any>;
}
