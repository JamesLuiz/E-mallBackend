import { Model } from 'mongoose';
import { OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { VendorsService } from '../vendors/vendors.service';
import { OrderStatus } from '../../common/enums/order-status.enum';
export declare class OrdersService {
    private orderModel;
    private productsService;
    private vendorsService;
    constructor(orderModel: Model<OrderDocument>, productsService: ProductsService, vendorsService: VendorsService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<OrderDocument>;
    findAll(): Promise<OrderDocument[]>;
    findByCustomer(customerId: string): Promise<OrderDocument[]>;
    findByVendor(userId: string): Promise<OrderDocument[]>;
    findOne(id: string): Promise<OrderDocument>;
    updateStatus(id: string, status: OrderStatus, userId: string): Promise<OrderDocument>;
    cancel(id: string, userId: string): Promise<OrderDocument>;
    track(orderId: string): Promise<any>;
    private updateOrderStatus;
}
