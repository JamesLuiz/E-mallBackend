import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorBioDto } from './dto/vendor-bio.dto';
import { VendorCompanyDto } from './dto/vendor-company.dto';
import { VendorKycDto } from './dto/vendor-kyc.dto';

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
    return this.vendorsService.create(userId, createVendorDto.businessName);
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
    @Body() updateVendorDto: any,
  ) {
    return this.vendorsService.updateByUserId(userId, updateVendorDto);
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

  @Post('kyc/bio-data')
  @ApiOperation({ summary: 'Submit vendor KYC bio-data' })
  async kycBioData(
    @CurrentUser('_id') userId: string,
    @Body() bioDto: VendorBioDto,
  ) {
    return this.vendorsService.kycBioData(userId, bioDto);
  }

  @Post('kyc/company-info')
  @ApiOperation({ summary: 'Submit vendor KYC company info' })
  async kycCompanyInfo(
    @CurrentUser('_id') userId: string,
    @Body() companyDto: VendorCompanyDto,
  ) {
    return this.vendorsService.kycCompanyInfo(userId, companyDto);
  }

  @Post('kyc/documents')
  @UseInterceptors(FilesInterceptor('documents'))
  @ApiOperation({ summary: 'Submit vendor KYC documents' })
  async kycDocuments(
    @CurrentUser('_id') userId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() kycDto: VendorKycDto,
  ) {
    return this.vendorsService.kycDocuments(userId, files, kycDto);
  }

  @Get(':vendorId/products')
  @ApiOperation({ summary: 'Get products for a vendor' })
  async getVendorProducts(
    @Param('vendorId') vendorId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.vendorsService.getVendorProducts(vendorId, { page, limit, status, category });
  }
}