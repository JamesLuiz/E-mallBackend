declare class OrderItemDto {
    productId: string;
    quantity: number;
}
declare class ShippingAddressDto {
    address: string;
    city: string;
    phone: string;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shipping: ShippingAddressDto;
    paymentMethod: string;
}
export {};
