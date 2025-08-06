import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<import("./schemas/order.schema").OrderDocument>;
    findAll(filter: OrderFilterDto): Promise<import("./schemas/order.schema").OrderDocument[]>;
    getMyOrders(userId: string, filter: OrderFilterDto): Promise<import("./schemas/order.schema").OrderDocument[]>;
    getVendorOrders(userId: string, filter: OrderFilterDto): Promise<import("./schemas/order.schema").OrderDocument[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").OrderDocument>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, userId: string): Promise<import("./schemas/order.schema").OrderDocument>;
    cancel(id: string, userId: string, reason?: string): Promise<import("./schemas/order.schema").OrderDocument>;
    track(orderId: string): Promise<any>;
}
