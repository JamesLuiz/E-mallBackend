import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationFilterDto } from './dto/notification-filter.dto';
export declare class NotificationsService {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(filter: NotificationFilterDto): Promise<Notification[]>;
    findOne(id: string): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    remove(id: string): Promise<void>;
}
