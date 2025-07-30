import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { AdminService } from './admin.service';
import { VendorsService } from '../vendors/vendors.service';
import { OrdersService } from '../orders/orders.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly vendorsService: VendorsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  getDashboard() {
    return this.adminService.getDashboardData();
  }

  @Get('vendors')
  @ApiOperation({ summary: 'Get all vendors' })
  getAllVendors() {
    return this.vendorsService.findAll();
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders' })
  getAllOrders() {
    return this.ordersService.findAll();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get platform analytics' })
  getAnalytics() {
    return this.adminService.getPlatformAnalytics();
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get all payment transactions' })
  getAllPayments() {
    return this.adminService.getAllPayments();
  }
}