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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.Order = exports.DeliveryInfo = exports.PaymentInfo = exports.ShippingAddress = exports.OrderItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_status_enum_1 = require("../../../common/enums/order-status.enum");
const payment_status_enum_1 = require("../../../common/enums/payment-status.enum");
let OrderItem = class OrderItem {
};
exports.OrderItem = OrderItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrderItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderItem.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderItem.prototype, "total", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, mongoose_1.Schema)()
], OrderItem);
let ShippingAddress = class ShippingAddress {
};
exports.ShippingAddress = ShippingAddress;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ShippingAddress.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ShippingAddress.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ShippingAddress.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ShippingAddress.prototype, "deliveryCost", void 0);
exports.ShippingAddress = ShippingAddress = __decorate([
    (0, mongoose_1.Schema)()
], ShippingAddress);
let PaymentInfo = class PaymentInfo {
};
exports.PaymentInfo = PaymentInfo;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentInfo.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: payment_status_enum_1.PaymentStatus, default: payment_status_enum_1.PaymentStatus.PENDING }),
    __metadata("design:type", String)
], PaymentInfo.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentInfo.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PaymentInfo.prototype, "amount", void 0);
exports.PaymentInfo = PaymentInfo = __decorate([
    (0, mongoose_1.Schema)()
], PaymentInfo);
let DeliveryInfo = class DeliveryInfo {
};
exports.DeliveryInfo = DeliveryInfo;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DeliveryInfo.prototype, "partnerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'pending' }),
    __metadata("design:type", String)
], DeliveryInfo.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DeliveryInfo.prototype, "trackingId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DeliveryInfo.prototype, "estimatedTime", void 0);
exports.DeliveryInfo = DeliveryInfo = __decorate([
    (0, mongoose_1.Schema)()
], DeliveryInfo);
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "vendorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [OrderItem], required: true }),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ShippingAddress, required: true }),
    __metadata("design:type", ShippingAddress)
], Order.prototype, "shipping", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaymentInfo, required: true }),
    __metadata("design:type", PaymentInfo)
], Order.prototype, "payment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: DeliveryInfo }),
    __metadata("design:type", DeliveryInfo)
], Order.prototype, "delivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: order_status_enum_1.OrderStatus, default: order_status_enum_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=order.schema.js.map