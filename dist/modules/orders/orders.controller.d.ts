import { OrderStatus } from '../../common/enums/order-status.enum';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<import("./schemas/order.schema").Order>;
    findAll(): Promise<import("./schemas/order.schema").Order[]>;
    getMyOrders(userId: string): Promise<import("./schemas/order.schema").Order[]>;
    getVendorOrders(userId: string): Promise<import("./schemas/order.schema").Order[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").Order>;
    updateStatus(id: string, status: OrderStatus, userId: string): Promise<import("./schemas/order.schema").Order>;
    cancel(id: string, userId: string): Promise<import("./schemas/order.schema").Order>;
    track(orderId: string): Promise<any>;
}
