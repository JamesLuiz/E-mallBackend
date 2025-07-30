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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const products_service_1 = require("../products/products.service");
const vendors_service_1 = require("../vendors/vendors.service");
const order_status_enum_1 = require("../../common/enums/order-status.enum");
const payment_status_enum_1 = require("../../common/enums/payment-status.enum");
let OrdersService = class OrdersService {
    constructor(orderModel, productsService, vendorsService) {
        this.orderModel = orderModel;
        this.productsService = productsService;
        this.vendorsService = vendorsService;
    }
    async create(userId, createOrderDto) {
        const orderItems = [];
        let totalAmount = 0;
        let vendorId = null;
        for (const item of createOrderDto.items) {
            const product = await this.productsService.findOne(item.productId);
            if (product.inventory.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product: ${product.name}`);
            }
            if (vendorId === null) {
                vendorId = product.vendorId;
            }
            else if (vendorId.toString() !== product.vendorId.toString()) {
                throw new common_1.BadRequestException('All products must be from the same vendor');
            }
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                total: itemTotal,
            });
        }
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const createdOrder = new this.orderModel({
            customerId: userId,
            vendorId,
            orderNumber,
            items: orderItems,
            shipping: createOrderDto.shipping,
            payment: {
                method: createOrderDto.paymentMethod,
                status: payment_status_enum_1.PaymentStatus.PENDING,
                amount: totalAmount,
            },
            delivery: {
                status: 'pending',
            },
        });
        const savedOrder = await createdOrder.save();
        for (const item of createOrderDto.items) {
            await this.productsService.updateInventory(item.productId, item.quantity);
        }
        return savedOrder;
    }
    async findAll() {
        return this.orderModel
            .find()
            .populate('customerId', 'email profile')
            .populate('vendorId', 'businessName')
            .populate('items.productId', 'name images')
            .exec();
    }
    async findByCustomer(customerId) {
        return this.orderModel
            .find({ customerId })
            .populate('vendorId', 'businessName storeSettings')
            .populate('items.productId', 'name images')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByVendor(userId) {
        const vendor = await this.vendorsService.findByUserId(userId);
        return this.orderModel
            .find({ vendorId: vendor._id })
            .populate('customerId', 'email profile')
            .populate('items.productId', 'name images')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const order = await this.orderModel
            .findById(id)
            .populate('customerId', 'email profile')
            .populate('vendorId', 'businessName storeSettings')
            .populate('items.productId', 'name images')
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateStatus(id, status, userId) {
        const order = await this.findOne(id);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (order.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.BadRequestException('You can only update your own orders');
        }
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .populate('customerId', 'email profile')
            .populate('vendorId', 'businessName')
            .populate('items.productId', 'name images')
            .exec();
        return updatedOrder;
    }
    async cancel(id, userId) {
        const order = await this.findOne(id);
        if (order.customerId.toString() !== userId) {
            throw new common_1.BadRequestException('You can only cancel your own orders');
        }
        if (![order_status_enum_1.OrderStatus.PENDING, order_status_enum_1.OrderStatus.CONFIRMED].includes(order.status)) {
            throw new common_1.BadRequestException('Order cannot be cancelled at this stage');
        }
        return this.updateOrderStatus(id, order_status_enum_1.OrderStatus.CANCELLED);
    }
    async track(orderId) {
        const order = await this.findOne(orderId);
        return {
            orderNumber: order.orderNumber,
            status: order.status,
            delivery: order.delivery,
            estimatedDelivery: order.delivery.estimatedTime,
            timeline: [
                { status: 'Order Placed', date: order.createdAt, completed: true },
                { status: 'Order Confirmed', date: null, completed: order.status !== order_status_enum_1.OrderStatus.PENDING },
                { status: 'Shipped', date: null, completed: order.status === order_status_enum_1.OrderStatus.SHIPPED || order.status === order_status_enum_1.OrderStatus.DELIVERED },
                { status: 'Delivered', date: null, completed: order.status === order_status_enum_1.OrderStatus.DELIVERED },
            ],
        };
    }
    async updateOrderStatus(id, status) {
        return this.orderModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .populate('customerId', 'email profile')
            .populate('vendorId', 'businessName')
            .populate('items.productId', 'name images')
            .exec();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService,
        vendors_service_1.VendorsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map