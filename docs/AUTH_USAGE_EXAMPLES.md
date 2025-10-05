# Authentication Usage Examples

This document provides practical examples of how to use the authentication system in your controllers and services.

## Basic Controller Examples

### 1. Protected Route (Requires Authentication)

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return {
      id: user._id,
      email: user.email,
      roles: user.roles,
      profile: user.profile
    };
  }
}
```

### 2. Role-based Access Control

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin')
export class AdminController {
  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminDashboard() {
    return { message: 'Admin dashboard data' };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  getUsers() {
    return { message: 'Users list' };
  }
}
```

### 3. Public Route (No Authentication Required)

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('public')
export class PublicController {
  @Get('info')
  @Public()
  getPublicInfo() {
    return { message: 'This is public information' };
  }
}
```

### 4. Mixed Routes (Some Public, Some Protected)

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('products')
export class ProductsController {
  // Public route - anyone can view products
  @Get()
  @Public()
  getAllProducts() {
    return { products: [] };
  }

  // Protected route - only authenticated users can create products
  @Post()
  @UseGuards(JwtAuthGuard)
  createProduct() {
    return { message: 'Product created' };
  }
}
```

## Service Examples

### 1. Using Current User in Service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private orderModel: Model<any>,
  ) {}

  async getUserOrders(userId: string) {
    return this.orderModel.find({ userId }).exec();
  }

  async createOrder(userId: string, orderData: any) {
    const order = new this.orderModel({
      ...orderData,
      userId,
      createdAt: new Date(),
    });
    return order.save();
  }
}
```

### 2. Controller Using Service with User Context

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@CurrentUser('_id') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @CurrentUser('_id') userId: string,
    @Body() orderData: any
  ) {
    return this.ordersService.createOrder(userId, orderData);
  }
}
```

## Advanced Examples

### 1. Conditional Access Based on User Role

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('analytics')
export class AnalyticsController {
  @Get('sales')
  @UseGuards(JwtAuthGuard)
  async getSalesData(@CurrentUser() user: any) {
    if (user.roles.includes(UserRole.ADMIN)) {
      // Admin can see all sales data
      return this.getAllSalesData();
    } else if (user.roles.includes(UserRole.VENDOR)) {
      // Vendor can only see their own sales data
      return this.getVendorSalesData(user._id);
    } else {
      // Customer cannot access sales data
      throw new ForbiddenException('Access denied');
    }
  }
}
```

### 2. Multiple Role Requirements

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('reports')
export class ReportsController {
  // Either ADMIN or VENDOR can access
  @Get('financial')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  getFinancialReports() {
    return { reports: [] };
  }

  // Only ADMIN can access
  @Get('system')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getSystemReports() {
    return { reports: [] };
  }
}
```

### 3. Custom Guard Implementation

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Check if user's email is verified
    return user && user.emailVerified === true;
  }
}
```

### 4. Using Custom Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from './guards/email-verified.guard';

@Controller('verified-only')
export class VerifiedOnlyController {
  @Get('sensitive-data')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  getSensitiveData() {
    return { message: 'This requires verified email' };
  }
}
```

## Error Handling Examples

### 1. Custom Error Responses

```typescript
import { Controller, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('premium')
export class PremiumController {
  @Get('content')
  @UseGuards(JwtAuthGuard)
  getPremiumContent(@CurrentUser() user: any) {
    if (!user.roles.includes(UserRole.PREMIUM)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Premium subscription required',
          error: 'Forbidden'
        },
        HttpStatus.FORBIDDEN
      );
    }
    
    return { content: 'Premium content here' };
  }
}
```

### 2. Validation with Authentication

```typescript
import { Controller, Post, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsNotEmpty } from 'class-validator';

class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

@Controller('posts')
export class PostsController {
  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(
    @CurrentUser() user: any,
    @Body() createPostDto: CreatePostDto
  ) {
    // Additional validation based on user role
    if (user.roles.includes(UserRole.CUSTOMER) && createPostDto.content.length > 1000) {
      throw new BadRequestException('Customers cannot create posts longer than 1000 characters');
    }
    
    return {
      message: 'Post created',
      author: user.email,
      post: createPostDto
    };
  }
}
```

## Testing Examples

### 1. Testing Protected Routes

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Protected Routes', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get access token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    accessToken = loginResponse.body.access_token;
  });

  it('should access protected route with valid token', () => {
    return request(app.getHttpServer())
      .get('/api/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('should reject request without token', () => {
    return request(app.getHttpServer())
      .get('/api/profile')
      .expect(401);
  });

  it('should reject request with invalid token', () => {
    return request(app.getHttpServer())
      .get('/api/profile')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401);
  });
});
```

### 2. Testing Role-based Access

```typescript
describe('Role-based Access', () => {
  let adminToken: string;
  let customerToken: string;

  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword'
      });
    adminToken = adminResponse.body.access_token;

    // Login as customer
    const customerResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'customer@example.com',
        password: 'customerpassword'
      });
    customerToken = customerResponse.body.access_token;
  });

  it('should allow admin to access admin route', () => {
    return request(app.getHttpServer())
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should deny customer access to admin route', () => {
    return request(app.getHttpServer())
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);
  });
});
```

## Best Practices Summary

1. **Always use guards**: Apply `JwtAuthGuard` to protected routes
2. **Use role guards**: Apply `RolesGuard` with `@Roles()` decorator for role-based access
3. **Mark public routes**: Use `@Public()` decorator for routes that don't require authentication
4. **Extract user data**: Use `@CurrentUser()` decorator to get current user information
5. **Validate input**: Always validate request data with DTOs
6. **Handle errors gracefully**: Provide meaningful error messages
7. **Test thoroughly**: Write tests for both authenticated and unauthenticated scenarios
8. **Document endpoints**: Use Swagger decorators for API documentation
