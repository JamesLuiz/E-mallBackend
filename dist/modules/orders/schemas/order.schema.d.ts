import { Document, Types } from 'mongoose';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
export type OrderDocument = Order & Document;
export declare class OrderItem {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    total: number;
}
export declare class ShippingAddress {
    address: string;
    city: string;
    phone: string;
    deliveryCost: number;
}
export declare class PaymentInfo {
    method: string;
    status: PaymentStatus;
    transactionId: string;
    amount: number;
}
export declare class DeliveryInfo {
    partnerId: string;
    status: string;
    trackingId: string;
    estimatedTime: Date;
}
export declare class Order {
    customerId: Types.ObjectId;
    vendorId: Types.ObjectId;
    orderNumber: string;
    items: OrderItem[];
    shipping: ShippingAddress;
    payment: PaymentInfo;
    delivery: DeliveryInfo;
    status: OrderStatus;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
}>;
