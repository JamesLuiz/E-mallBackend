import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initializePayment(userId: string, amount: number, orderId: string): Promise<{
        reference: string;
        authorization_url: string;
        amount: number;
        orderId: string;
    }>;
    verifyPayment(reference: string): Promise<{
        reference: string;
        status: string;
        amount: number;
        gateway_response: string;
        paid_at: Date;
    }>;
    getHistory(userId: string): Promise<{
        payments: any[];
        total: number;
    }>;
    processRefund(paymentId: string, amount: number): Promise<{
        refund_id: string;
        amount: number;
        status: string;
        processed_at: Date;
    }>;
    getVendorPayouts(userId: string): Promise<{
        payouts: any[];
        total_earnings: number;
        pending_payouts: number;
    }>;
}
