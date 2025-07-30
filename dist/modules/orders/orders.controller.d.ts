import { OrderStatus } from '../../common/enums/order-status.enum';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<import("./schemas/order.schema").OrderDocument>;
    findAll(): Promise<import("./schemas/order.schema").OrderDocument[]>;
    getMyOrders(userId: string): Promise<import("./schemas/order.schema").OrderDocument[]>;
    getVendorOrders(userId: string): Promise<import("./schemas/order.schema").OrderDocument[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").OrderDocument>;
    updateStatus(id: string, status: OrderStatus, userId: string): Promise<import("./schemas/order.schema").OrderDocument>;
    cancel(id: string, userId: string): Promise<import("./schemas/order.schema").OrderDocument>;
    track(orderId: string): Promise<any>;
}
