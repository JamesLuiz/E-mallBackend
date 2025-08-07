"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
let PaymentsService = class PaymentsService {
    async initializePayment(userId, amount, orderId) {
        const reference = `pay_${Date.now()}_${orderId}`;
        return {
            reference,
            authorization_url: `https://checkout.paystack.com/pay/${reference}`,
            amount: amount * 100,
            orderId,
        };
    }
    async verifyPayment(reference) {
        return {
            reference,
            status: 'success',
            amount: 10000,
            gateway_response: 'Successful',
            paid_at: new Date(),
        };
    }
    async getPaymentHistory(userId) {
        return {
            payments: [],
            total: 0,
        };
    }
    async processRefund(paymentId, amount) {
        return {
            refund_id: `refund_${Date.now()}`,
            amount,
            status: 'success',
            processed_at: new Date(),
        };
    }
    async getVendorPayouts(userId) {
        return {
            payouts: [],
            total_earnings: 0,
            pending_payouts: 0,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
//# sourceMappingURL=payments.service.js.map