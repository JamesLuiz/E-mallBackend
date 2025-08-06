# Abuja Mall Backend Architecture - NestJS + MongoDB

## Table of Contents
1. [Project Structure](#project-structure)
2. [Database Schemas](#database-schemas)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Authorization](#authentication--authorization)
5. [File Upload Strategy](#file-upload-strategy)
6. [Real-time Features](#real-time-features)
7. [Environment Variables](#environment-variables)

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── vendor.guard.ts
│   ├── interceptors/
│   │   ├── transform.interceptor.ts
│   │   └── logging.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── interfaces/
│       ├── jwt-payload.interface.ts
│       └── request-with-user.interface.ts
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── cloudinary.config.ts
│   └── google-oauth.config.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── local.strategy.ts
│   └── dto/
│       ├── register.dto.ts
│       ├── login.dto.ts
│       ├── vendor-register.dto.ts
│       └── customer-register.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       └── update-profile.dto.ts
├── vendors/
│   ├── vendors.module.ts
│   ├── vendors.controller.ts
│   ├── vendors.service.ts
│   ├── schemas/
│   │   └── vendor.schema.ts
│   └── dto/
│       ├── create-vendor.dto.ts
│       ├── update-vendor.dto.ts
│       ├── vendor-bio.dto.ts
│       ├── vendor-company.dto.ts
│       └── vendor-kyc.dto.ts
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── schemas/
│   │   └── product.schema.ts
│   └── dto/
│       ├── create-product.dto.ts
│       ├── update-product.dto.ts
│       └── product-filter.dto.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── schemas/
│   │   └── category.schema.ts
│   └── dto/
│       ├── create-category.dto.ts
│       └── update-category.dto.ts
├── orders/
│   ├── orders.module.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── schemas/
│   │   └── order.schema.ts
│   └── dto/
│       ├── create-order.dto.ts
│       ├── update-order-status.dto.ts
│       └── order-filter.dto.ts
├── analytics/
│   ├── analytics.module.ts
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   ├── schemas/
│   │   └── analytics.schema.ts
│   └── dto/
│       └── analytics-query.dto.ts
├── payments/
│   ├── payments.module.ts
│   ├── payments.controller.ts
│   ├── payments.service.ts
│   ├── schemas/
│   │   └── payment.schema.ts
│   └── dto/
│       ├── create-payment.dto.ts
│       └── payment-webhook.dto.ts
├── notifications/
│   ├── notifications.module.ts
│   ├── notifications.controller.ts
│   ├── notifications.service.ts
│   ├── schemas/
│   │   └── notification.schema.ts
│   └── dto/
│       ├── create-notification.dto.ts
│       └── notification-filter.dto.ts
├── uploads/
│   ├── uploads.module.ts
│   ├── uploads.controller.ts
│   ├── uploads.service.ts
│   └── dto/
│       └── upload-file.dto.ts
├── blog/
│   ├── blog.module.ts
│   ├── blog.controller.ts
│   ├── blog.service.ts
│   ├── schemas/
│   │   └── article.schema.ts
│   └── dto/
│       ├── create-article.dto.ts
│       ├── update-article.dto.ts
│       └── article-filter.dto.ts
├── careers/
│   ├── careers.module.ts
│   ├── careers.controller.ts
│   ├── careers.service.ts
│   ├── schemas/
│   │   ├── job.schema.ts
│   │   └── application.schema.ts
│   └── dto/
│       ├── create-job.dto.ts
│       ├── update-job.dto.ts
│       ├── create-application.dto.ts
│       └── job-filter.dto.ts
└── support/
    ├── support.module.ts
    ├── support.controller.ts
    ├── support.service.ts
    ├── schemas/
    │   └── ticket.schema.ts
    └── dto/
        ├── create-ticket.dto.ts
        ├── update-ticket.dto.ts
        └── ticket-filter.dto.ts
```

## Database Schemas

### User Schema
```typescript
// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop()
  password?: string; // Optional for Google OAuth users

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  avatar?: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.CUSTOMER] })
  roles: UserRole[];

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop()
  googleId?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  vendorProfile?: Types.ObjectId;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ type: Object })
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private';
    };
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### Vendor Schema
```typescript
// vendors/schemas/vendor.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorDocument = Vendor & Document;

export enum VendorStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export enum BusinessType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
  PARTNERSHIP = 'partnership'
}

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  businessAddress: string;

  @Prop({ required: true })
  businessEmail: string;

  @Prop({ required: true })
  businessPhone: string;

  @Prop({ enum: BusinessType, required: true })
  businessType: BusinessType;

  @Prop()
  businessRegistrationNumber?: string;

  @Prop()
  taxIdentificationNumber?: string;

  @Prop()
  businessDescription?: string;

  @Prop()
  businessLogo?: string;

  @Prop({ type: [String] })
  businessImages?: string[];

  @Prop({ enum: VendorStatus, default: VendorStatus.PENDING })
  verificationStatus: VendorStatus;

  @Prop()
  verificationNotes?: string;

  @Prop({ type: [String] })
  categories: string[];

  @Prop({ type: Object })
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  };

  @Prop({ type: Object })
  kycDocuments?: {
    identityDocument: {
      type: 'passport' | 'national_id' | 'drivers_license';
      url: string;
      verified: boolean;
    };
    proofOfAddress: {
      url: string;
      verified: boolean;
    };
    businessCertificate?: {
      url: string;
      verified: boolean;
    };
  };

  @Prop({ type: Object })
  analytics?: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    rating: number;
    reviewCount: number;
  };

  @Prop({ type: Object })
  subscription?: {
    plan: 'basic' | 'premium' | 'enterprise';
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
```

### Product Schema
```typescript
// products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  shortDescription?: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discountPrice?: number;

  @Prop({ required: true })
  sku: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ required: true })
  stock: number;

  @Prop({ enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @Prop({ type: Object })
  specifications?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    color?: string;
    material?: string;
    brand?: string;
    model?: string;
  };

  @Prop({ type: Object })
  shipping?: {
    cost: number;
    estimatedDays: number;
    freeShippingThreshold?: number;
  };

  @Prop({ type: Object })
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  sales: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: false })
  featured: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

### Order Schema
```typescript
// orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: [Object], required: true })
  items: {
    productId: Types.ObjectId;
    vendorId: Types.ObjectId;
    name: string;
    price: number;
    discountPrice?: number;
    quantity: number;
    image: string;
  }[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  shippingCost: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ required: true })
  total: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ type: Object, required: true })
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Prop({ type: Object })
  billingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Prop({ type: Object })
  tracking?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    currentLocation?: string;
  };

  @Prop({ type: [Object] })
  statusHistory?: {
    status: OrderStatus;
    date: Date;
    note?: string;
  }[];

  @Prop()
  notes?: string;

  @Prop()
  cancelReason?: string;

  @Prop()
  refundAmount?: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
```

## API Endpoints

### Authentication Endpoints
```typescript
// POST /auth/register/customer
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

// POST /auth/register/vendor
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  businessType: 'individual' | 'company' | 'partnership';
  businessDescription?: string;
  categories: string[];
}

// POST /auth/login
{
  email: string;
  password: string;
}

// GET /auth/google
// GET /auth/google/callback

// POST /auth/forgot-password
{
  email: string;
}

// POST /auth/reset-password
{
  token: string;
  newPassword: string;
}

// POST /auth/verify-email
{
  token: string;
}

// POST /auth/resend-verification
{
  email: string;
}

// POST /auth/logout
// Headers: Authorization: Bearer <token>
```

### User Endpoints
```typescript
// GET /users/profile
// Headers: Authorization: Bearer <token>

// PUT /users/profile
// Headers: Authorization: Bearer <token>
{
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  preferences?: object;
}

// POST /users/upload-avatar
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
{
  avatar: File;
}

// PUT /users/change-password
// Headers: Authorization: Bearer <token>
{
  currentPassword: string;
  newPassword: string;
}
```

### Vendor Endpoints
```typescript
// GET /vendors
// Query: page?, limit?, category?, search?, status?

// GET /vendors/:id

// PUT /vendors/profile
// Headers: Authorization: Bearer <token>
{
  businessName?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  categories?: string[];
}

// POST /vendors/kyc/bio-data
// Headers: Authorization: Bearer <token>
{
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
}

// POST /vendors/kyc/company-info
// Headers: Authorization: Bearer <token>
{
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  };
}

// POST /vendors/kyc/documents
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
{
  identityDocument: File;
  identityDocumentType: 'passport' | 'national_id' | 'drivers_license';
  proofOfAddress: File;
  businessCertificate?: File;
}

// GET /vendors/analytics
// Headers: Authorization: Bearer <token>
// Query: startDate?, endDate?, granularity?

// GET /vendors/:vendorId/products
// Query: page?, limit?, status?, category?
```

### Product Endpoints
```typescript
// GET /products
// Query: page?, limit?, category?, vendor?, search?, minPrice?, maxPrice?, status?

// GET /products/:id

// POST /products
// Headers: Authorization: Bearer <token>
{
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  sku: string;
  categoryId: string;
  images: string[];
  tags?: string[];
  stock: number;
  specifications?: object;
  shipping?: object;
  seo?: object;
}

// PUT /products/:id
// Headers: Authorization: Bearer <token>
{
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  status?: string;
  // ... other fields
}

// DELETE /products/:id
// Headers: Authorization: Bearer <token>

// POST /products/:id/images
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
{
  images: File[];
}

// GET /products/featured
// GET /products/trending
// GET /products/categories/:categoryId
```

### Order Endpoints
```typescript
// GET /orders
// Headers: Authorization: Bearer <token>
// Query: page?, limit?, status?, startDate?, endDate?

// GET /orders/:id
// Headers: Authorization: Bearer <token>

// POST /orders
// Headers: Authorization: Bearer <token>
{
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: object;
  notes?: string;
}

// PUT /orders/:id/status
// Headers: Authorization: Bearer <token>
{
  status: OrderStatus;
  note?: string;
  trackingNumber?: string;
  carrier?: string;
}

// POST /orders/:id/cancel
// Headers: Authorization: Bearer <token>
{
  reason: string;
}

// GET /orders/:id/tracking
// Headers: Authorization: Bearer <token>

// GET /vendors/orders
// Headers: Authorization: Bearer <token>
// Query: page?, limit?, status?, startDate?, endDate?
```

### Category Endpoints
```typescript
// GET /categories

// GET /categories/:id

// POST /categories
// Headers: Authorization: Bearer <token> (Admin only)
{
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}

// PUT /categories/:id
// Headers: Authorization: Bearer <token> (Admin only)

// DELETE /categories/:id
// Headers: Authorization: Bearer <token> (Admin only)
```

### Analytics Endpoints
```typescript
// GET /analytics/dashboard
// Headers: Authorization: Bearer <token>
// Query: startDate?, endDate?, granularity?

// GET /analytics/sales
// Headers: Authorization: Bearer <token>
// Query: startDate?, endDate?, granularity?, vendorId?

// GET /analytics/products
// Headers: Authorization: Bearer <token>
// Query: startDate?, endDate?, vendorId?

// GET /analytics/customers
// Headers: Authorization: Bearer <token>
// Query: startDate?, endDate?
```

### Upload Endpoints
```typescript
// POST /uploads/image
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
{
  image: File;
  folder?: string; // 'products', 'avatars', 'vendors', etc.
}

// POST /uploads/multiple
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
{
  images: File[];
  folder?: string;
}

// DELETE /uploads/:filename
// Headers: Authorization: Bearer <token>
```

## Authentication & Authorization

### JWT Strategy
```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
```

### Google OAuth Strategy
```typescript
// auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos[0].value,
      googleId: id,
    };
    done(null, user);
  }
}
```

### Role Guards
```typescript
// common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

## File Upload Strategy

### Cloudinary Configuration
```typescript
// config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
```

### Upload Service
```typescript
// uploads/uploads.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadsService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'general',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `abuja-mall/${folder}`,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
```

## Real-time Features

### WebSocket Gateway for Order Updates
```typescript
// notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      client.join(`user_${payload.sub}`);
      
      if (payload.roles.includes('vendor')) {
        client.join(`vendor_${payload.vendorId}`);
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Handle cleanup
  }

  sendOrderUpdate(userId: string, orderData: any) {
    this.server.to(`user_${userId}`).emit('orderUpdate', orderData);
  }

  sendVendorNotification(vendorId: string, notification: any) {
    this.server.to(`vendor_${vendorId}`).emit('vendorNotification', notification);
  }
}
```

## Environment Variables

```
# Database
MONGODB_URI=mongodb://localhost:27017/abuja-mall
MONGODB_TEST_URI=mongodb://localhost:27017/abuja-mall-test

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (SendGrid/Nodemailer)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@abujamall.com

# Payment (Paystack/Flutterwave)
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server
PORT=3000
NODE_ENV=development

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

## Package.json Dependencies

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/mongoose": "^10.0.0",
    "@nestjs/jwt": "^10.1.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/websockets": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.0.0",
    "mongoose": "^7.4.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "passport-google-oauth20": "^2.0.0",
    "passport-local": "^1.0.0",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "cloudinary": "^1.40.0",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.7.2",
    "@sendgrid/mail": "^7.7.0",
    "redis": "^4.6.7",
    "cache-manager": "^5.2.3",
    "cache-manager-redis-store": "^3.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^3.0.9",
    "@types/passport-google-oauth20": "^2.0.11",
    "@types/passport-local": "^1.0.35",
    "@types/bcryptjs": "^2.4.2",
    "@types/multer": "^1.4.7",
    "jest": "^29.5.0",
    "typescript": "^5.1.3"
  }
}
```

## Installation & Setup Commands

```bash
# 1. Create new NestJS project
npm i -g @nestjs/cli
nest new abuja-mall-backend

# 2. Install dependencies
npm install @nestjs/mongoose mongoose
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-google-oauth20 passport-local
npm install @nestjs/config
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
npm install bcryptjs class-validator class-transformer
npm install cloudinary multer
npm install @sendgrid/mail
npm install redis cache-manager cache-manager-redis-store

# 3. Install dev dependencies
npm install -D @types/passport-jwt @types/passport-google-oauth20 @types/passport-local
npm install -D @types/bcryptjs @types/multer

# 4. Generate modules
nest generate module auth
nest generate module users
nest generate module vendors
nest generate module products
nest generate module orders
nest generate module categories
nest generate module analytics
nest generate module uploads
nest generate module notifications

# 5. Generate controllers and services
nest generate controller auth
nest generate service auth
nest generate controller users
nest generate service users
# ... repeat for other modules
```

This architecture provides a scalable, maintainable backend for your Abuja Mall application with proper authentication, file uploads, real-time features, and comprehensive API coverage.
