"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const delivery_service_1 = require("./delivery.service");
let DeliveryController = class DeliveryController {
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    calculateCost(origin, destination, weight) {
        return this.deliveryService.calculateCost(origin, destination, weight);
    }
    assignDelivery(orderId, partnerId) {
        return this.deliveryService.assignDelivery(orderId, partnerId);
    }
    trackDelivery(orderId) {
        return this.deliveryService.trackDelivery(orderId);
    }
    updateStatus(deliveryId, status) {
        return this.deliveryService.updateDeliveryStatus(deliveryId, status);
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, common_1.Post)('calculate-cost'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate delivery cost' }),
    __param(0, (0, common_1.Body)('origin')),
    __param(1, (0, common_1.Body)('destination')),
    __param(2, (0, common_1.Body)('weight')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "calculateCost", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign delivery partner' }),
    __param(0, (0, common_1.Body)('orderId')),
    __param(1, (0, common_1.Body)('partnerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "assignDelivery", null);
__decorate([
    (0, common_1.Get)('track/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Track delivery' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "trackDelivery", null);
__decorate([
    (0, common_1.Put)('update-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update delivery status' }),
    __param(0, (0, common_1.Body)('deliveryId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "updateStatus", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, swagger_1.ApiTags)('Delivery'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('delivery'),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map