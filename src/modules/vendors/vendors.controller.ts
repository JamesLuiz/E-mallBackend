import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

@ApiTags('Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post('register')
  @Roles(UserRole.VENDOR, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Register as vendor' })
  create(
    @CurrentUser('_id') userId: string,
    @Body() createVendorDto: CreateVendorDto,
  ) {
    return this.vendorsService.create(userId, createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all verified vendors' })
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get('profile')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get vendor profile' })
  getProfile(@CurrentUser('_id') userId: string) {
    return this.vendorsService.findByUserId(userId);
  }

  @Put('profile')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Update vendor profile' })
  async updateProfile(
    @CurrentUser('_id') userId: string,
    @Body() updateVendorDto: Partial<CreateVendorDto>,
  ) {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.vendorsService.update(vendor._id.toString(), updateVendorDto);
  }

  @Get('dashboard')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get vendor dashboard data' })
  getDashboard(@CurrentUser('_id') userId: string) {
    return this.vendorsService.getDashboardData(userId);
  }

  @Get('analytics')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get vendor analytics' })
  getAnalytics(@CurrentUser('_id') userId: string) {
    return this.vendorsService.getAnalytics(userId);
  }

  @Put(':id/approve')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve vendor (Admin only)' })
  approve(@Param('id') id: string) {
    return this.vendorsService.approve(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }
}