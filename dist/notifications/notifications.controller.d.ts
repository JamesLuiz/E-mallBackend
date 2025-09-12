import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationFilterDto } from './dto/notification-filter.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(filter: NotificationFilterDto): Promise<import("./schemas/notification.schema").Notification[]>;
    findOne(id: string): Promise<import("./schemas/notification.schema").Notification>;
    create(createNotificationDto: CreateNotificationDto): Promise<import("./schemas/notification.schema").Notification>;
    markAsRead(id: string): Promise<import("./schemas/notification.schema").Notification>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
