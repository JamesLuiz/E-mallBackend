import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { VendorsService } from '../vendors/vendors.service';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
    private vendorsService: VendorsService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    // Validate and calculate order items
    const orderItems = [];
    let totalAmount = 0;
    let vendorId = null;

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);
      
      // Check stock availability
      if (product.inventory.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
      }

      // Ensure all products belong to the same vendor
      if (vendorId === null) {
        vendorId = product.vendorId;
      } else if (vendorId.toString() !== product.vendorId.toString()) {
        throw new BadRequestException('All products must be from the same vendor');
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

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order
    const createdOrder = new this.orderModel({
      customerId: userId,
      vendorId,
      orderNumber,
      items: orderItems,
      shipping: createOrderDto.shipping,
      payment: {
        method: createOrderDto.paymentMethod,
        status: PaymentStatus.PENDING,
        amount: totalAmount,
      },
      delivery: {
        status: 'pending',
      },
    });

    const savedOrder = await createdOrder.save();

    // Update product inventory
    for (const item of createOrderDto.items) {
      await this.productsService.updateInventory(item.productId, item.quantity);
    }

    return savedOrder;
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel
      .find()
      .populate('customerId', 'email profile')
      .populate('vendorId', 'businessName')
      .populate('items.productId', 'name images')
      .exec();
  }

  async findByCustomer(customerId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ customerId })
      .populate('vendorId', 'businessName storeSettings')
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByVendor(userId: string): Promise<OrderDocument[]> {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.orderModel
      .find({ vendorId: vendor._id })
      .populate('customerId', 'email profile')
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findById(id)
      .populate('customerId', 'email profile')
      .populate('vendorId', 'businessName storeSettings')
      .populate('items.productId', 'name images')
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus, userId: string): Promise<OrderDocument> {
    const order = await this.findOne(id);
    const vendor = await this.vendorsService.findByUserId(userId);

    // Check if the order belongs to the current vendor
    if (order.vendorId.toString() !== vendor._id.toString()) {
      throw new BadRequestException('You can only update your own orders');
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('customerId', 'email profile')
      .populate('vendorId', 'businessName')
      .populate('items.productId', 'name images')
      .exec();

    return updatedOrder;
  }

  async cancel(id: string, userId: string): Promise<OrderDocument> {
    const order = await this.findOne(id);

    // Check if the order belongs to the current customer
    if (order.customerId.toString() !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }

    // Only allow cancellation for pending or confirmed orders
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    return this.updateOrderStatus(id, OrderStatus.CANCELLED);
  }

  async track(orderId: string): Promise<any> {
    const order = await this.findOne(orderId);
    
    // Mock tracking data - in real implementation, integrate with delivery partners
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      delivery: order.delivery,
      estimatedDelivery: order.delivery.estimatedTime,
      timeline: [
        { status: 'Order Placed', date: order.createdAt, completed: true },
        { status: 'Order Confirmed', date: null, completed: order.status !== OrderStatus.PENDING },
        { status: 'Shipped', date: null, completed: order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED },
        { status: 'Delivered', date: null, completed: order.status === OrderStatus.DELIVERED },
      ],
    };
  }

  private async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDocument> {
    return this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('customerId', 'email profile')
      .populate('vendorId', 'businessName')
      .populate('items.productId', 'name images')
      .exec();
  }
}