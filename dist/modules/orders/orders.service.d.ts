import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { VendorsService } from '../vendors/vendors.service';
import { OrderStatus } from '../../common/enums/order-status.enum';
export declare class OrdersService {
    private orderModel;
    private productsService;
    private vendorsService;
    constructor(orderModel: Model<OrderDocument>, productsService: ProductsService, vendorsService: VendorsService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findByCustomer(customerId: string): Promise<Order[]>;
    findByVendor(userId: string): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    updateStatus(id: string, status: OrderStatus, userId: string): Promise<Order>;
    cancel(id: string, userId: string): Promise<Order>;
    track(orderId: string): Promise<any>;
    private updateOrderStatus;
}
