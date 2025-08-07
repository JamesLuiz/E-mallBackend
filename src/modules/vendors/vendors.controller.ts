import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';

@ApiTags('Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post('register')
  @Roles(UserRole.VENDOR, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Register as vendor' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Vendor registered successfully',
    type: VendorResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'User is already registered as vendor' 
  })
  async create(
    @CurrentUser('_id') userId: string,
    @Body() createVendorDto: CreateVendorDto,
  ): Promise<VendorResponseDto> {
    const vendor = await this.vendorsService.create(userId, createVendorDto.businessName);
    return plainToInstance(VendorResponseDto, vendor.toObject());
  }

  @Get()
  @ApiOperation({ summary: 'Get all verified vendors with optional filtering' })
  @ApiQuery({ name: 'search', required: false, description: 'Search vendors by name or description' })
  @ApiQuery({ name: 'verified', required: false, description: 'Filter by verification status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of vendors',
    type: [VendorResponseDto] 
  })
  async findAll(@Query() query: VendorQueryDto): Promise<VendorResponseDto[]> {
    const vendors = await this.vendorsService.findAll(query);
    return plainToInstance(VendorResponseDto, vendors.map(vendor => vendor.toObject()));
  }

  @Get('profile')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get current vendor profile' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vendor profile retrieved successfully',
    type: VendorResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vendor profile not found' 
  })
  async getProfile(@CurrentUser('_id') userId: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorsService.findByUserId(userId);
    return plainToInstance(VendorResponseDto, vendor.toObject());
  }

  @Put('profile')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Update current vendor profile' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vendor profile updated successfully',
    type: VendorResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vendor profile not found' 
  })
  async updateProfile(
    @CurrentUser('_id') userId: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<VendorResponseDto> {
    const vendor = await this.vendorsService.updateByUserId(userId, updateVendorDto);
    return plainToInstance(VendorResponseDto, vendor.toObject());
  }

  @Get('dashboard')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get vendor dashboard data' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Dashboard data retrieved successfully' 
  })
  async getDashboard(@CurrentUser('_id') userId: string) {
    return this.vendorsService.getDashboardData(userId);
  }

  @Get('analytics')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get vendor analytics' })
  @ApiQuery({ name: 'period', required: false, description: 'Analytics period (7d, 30d, 90d)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Analytics data retrieved successfully' 
  })
  async getAnalytics(
    @CurrentUser('_id') userId: string,
    @Query('period') period?: string,
  ) {
    return this.vendorsService.getAnalytics(userId, period);
  }

  @Get('pending')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get pending vendor approvals (Admin only)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of pending vendors',
    type: [VendorResponseDto] 
  })
  async getPendingVendors(): Promise<VendorResponseDto[]> {
    const vendors = await this.vendorsService.findPendingVendors();
    return plainToInstance(VendorResponseDto, vendors.map(vendor => vendor.toObject()));
  }

  @Put(':id/approve')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve vendor (Admin only)' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vendor approved successfully',
    type: VendorResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vendor not found' 
  })
  async approve(
    @Param('id') id: string,
    @CurrentUser('_id') adminId: string,
  ): Promise<VendorResponseDto> {
    const vendor = await this.vendorsService.approve(id);
    return plainToInstance(VendorResponseDto, vendor.toObject());
  }

  @Put(':id/reject')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject vendor (Admin only)' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vendor rejected successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vendor not found' 
  })
  async reject(
    @Param('id') id: string,
    @CurrentUser('_id') adminId: string,
    @Body('reason') reason?: string,
  ): Promise<VendorResponseDto> {
    const vendor = await this.vendorsService.reject(id, reason);
    return plainToInstance(VendorResponseDto, vendor.toObject());
  }

  @Put(':id/suspend')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Suspend vendor (Admin only)' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vendor suspended successfully' 
  })
  async suspend(
    @Param('id') id: string,
    @CurrentUser('_id') adminId: string,
    @Body('reason') reason?: string,
  ): Promise<VendorResponseDto> {
    const vendor = await this.vendorsService.suspend(id, reason);
    return plainToInstance(VendorResponseDto, vendor.toObject());
  }

  @Put(':id/reactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reactivate suspended vendor (Admin only)' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vendor reactivated successfully' 
  })
  async reactivate(
    @Param('id') id: string,
    @CurrentUser('_id') adminId: string,
  ): Promise<VendorResponseDto> {
    const vendor = await this.vendorsService.reactivate(id);
    return plainToInstance(VendorResponseDto, vendor.toObject());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vendor retrieved successfully',
    type: VendorResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vendor not found' 
  })
  async findOne(@Param('id') id: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorsService.findOne(id);
    return plainToInstance(VendorResponseDto, vendor.toObject());
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete vendor (Admin only)' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Vendor deleted successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vendor not found' 
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser('_id') adminId: string,
  ): Promise<void> {
    return this.vendorsService.remove(id);
  }
}