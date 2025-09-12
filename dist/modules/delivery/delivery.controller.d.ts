import { DeliveryService } from './delivery.service';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    calculateCost(origin: string, destination: string, weight: number): Promise<{
        cost: number;
        estimatedTime: string;
        partners: {
            name: string;
            cost: number;
        }[];
    }>;
    assignDelivery(orderId: string, partnerId: string): Promise<{
        deliveryId: string;
        orderId: string;
        partnerId: string;
        trackingId: string;
        estimatedTime: Date;
        status: string;
    }>;
    trackDelivery(orderId: string): Promise<{
        orderId: string;
        status: string;
        currentLocation: string;
        estimatedArrival: Date;
        driverInfo: {
            name: string;
            phone: string;
            rating: number;
        };
    }>;
    updateStatus(deliveryId: string, status: string): Promise<{
        deliveryId: string;
        status: string;
        updatedAt: Date;
    }>;
}
