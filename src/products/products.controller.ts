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
  UploadedFiles,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ProductsService } from './products.service';
import { VendorsService } from '../modules/vendors/vendors.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { VendorFilterDto } from './dto/vendor-filter.dto';
import { VendorKycUpdateDto } from './dto/vendor-kyc-update.dto';
import { VendorRatingUpdateDto } from './dto/vendor-rating-update.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly vendorsService: VendorsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() filter: ProductFilterDto) {
    return this.productsService.findAll(filter);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product (Vendor only)' })
  create(
    @CurrentUser('_id') userId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(userId, createProductDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all product categories' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('search')
  @ApiOperation({ summary: 'Advanced product search' })
  @ApiQuery({ name: 'q', required: true, description: 'Search term' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  search(@Query('q') searchTerm: string, @Query() filter: ProductFilterDto) {
    return this.productsService.search(searchTerm, filter);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products to return' })
  getFeatured(@Query('limit') limit?: number) {
    return this.productsService.getFeatured(limit);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products to return' })
  getTrending(@Query('limit') limit?: number) {
    return this.productsService.getTrending(limit);
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Get new arrival products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products to return' })
  getNewArrivals(@Query('limit') limit?: number) {
    return this.productsService.getNewArrivals(limit);
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Get top rated products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products to return' })
  getTopRated(@Query('limit') limit?: number) {
    return this.productsService.getTopRated(limit);
  }

  @Get('on-sale')
  @ApiOperation({ summary: 'Get products on sale' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products to return' })
  getOnSale(@Query('limit') limit?: number) {
    return this.productsService.getOnSale(limit);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({ name: 'category', description: 'Product category' })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getByCategory(@Param('category') category: string, @Query() filter: ProductFilterDto) {
    return this.productsService.getByCategory(category, filter);
  }

  @Get('vendor/my-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current vendor products' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getMyProducts(@CurrentUser('_id') userId: string, @Query() filter: ProductFilterDto) {
    return this.productsService.findByCurrentVendor(userId, filter);
  }

  @Get('vendor/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor product statistics' })
  getVendorStats(@CurrentUser('_id') userId: string) {
    return this.productsService.getVendorProductStats(userId);
  }

  @Get('vendor/low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get low stock products for vendor' })
  getLowStockProducts(@CurrentUser('_id') userId: string) {
    return this.productsService.getLowStockProducts(userId);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get products by vendor ID' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getVendorProducts(@Param('vendorId') vendorId: string, @Query() filter: ProductFilterDto) {
    return this.productsService.findByVendor(vendorId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of related products' })
  getRelatedProducts(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.productsService.getRelatedProducts(id, limit);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get product statistics' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  getProductStats(@Param('id') id: string) {
    return this.productsService.getProductStats(id);
  }

  @Get(':id/images')
  @ApiOperation({ summary: 'Get product images' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  getProductImages(@Param('id') id: string) {
    return this.productsService.getProductImages(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Vendor only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  update(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, userId, updateProductDto);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle product featured status (Vendor only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  toggleFeatured(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.productsService.toggleFeatured(id, userId);
  }

  @Patch(':id/increment-views')
  @ApiOperation({ summary: 'Increment product view count' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  incrementViews(@Param('id') id: string) {
    return this.productsService.incrementViews(id);
  }

  @Patch('bulk-update-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update product status (Vendor only)' })
  bulkUpdateStatus(
    @CurrentUser('_id') userId: string,
    @Body() body: { productIds: string[]; status: string },
  ) {
    return this.productsService.bulkUpdateStatus(body.productIds, body.status, userId);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duplicate product (Vendor only)' })
  @ApiParam({ name: 'id', description: 'Product ID to duplicate' })
  duplicateProduct(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.productsService.duplicateProduct(id, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Vendor only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  remove(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.productsService.remove(id, userId);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiOperation({ summary: 'Upload product images (Vendor only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser('_id') userId: string,
  ) {
    return this.productsService.uploadImages(id, userId, files);
  }

  @Put(':id/images/:imageHash/primary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set primary product image (Vendor only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'imageHash', description: 'Image hash' })
  setPrimaryImage(
    @Param('id') id: string,
    @Param('imageHash') imageHash: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.productsService.setPrimaryImage(id, userId, imageHash);
  }

  @Delete(':id/images/:imageHash')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove product image (Vendor only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'imageHash', description: 'Image hash' })
  removeProductImage(
    @Param('id') id: string,
    @Param('imageHash') imageHash: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.productsService.removeProductImage(id, userId, imageHash);
  }

  // Vendor Management Endpoints
  @Get('vendors')
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiQuery({ name: 'search', required: false, description: 'Search vendors by name' })
  @ApiQuery({ name: 'verified', required: false, description: 'Filter by verification status' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getVendors(@Query() query: VendorFilterDto) {
    return this.vendorsService.findAll(query);
  }

  @Get('vendors/:vendorId/profile')
  @ApiOperation({ summary: 'Get vendor profile by ID' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  getVendorProfile(@Param('vendorId') vendorId: string) {
    return this.vendorsService.findOne(vendorId);
  }

  @Get('vendors/:vendorId/products')
  @ApiOperation({ summary: 'Get products by specific vendor' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getVendorProductsById(@Param('vendorId') vendorId: string, @Query() filter: ProductFilterDto) {
    return this.productsService.findByVendor(vendorId, filter);
  }

  @Get('vendors/:vendorId/analytics')
  @ApiOperation({ summary: 'Get vendor analytics' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiQuery({ name: 'period', required: false, description: 'Analytics period' })
  getVendorAnalytics(@Param('vendorId') vendorId: string, @Query('period') period?: string) {
    return this.vendorsService.getAnalytics(vendorId, period);
  }

  @Get('vendors/verified')
  @ApiOperation({ summary: 'Get all verified vendors' })
  getVerifiedVendors() {
    return this.vendorsService.getVerified();
  }

  @Get('vendors/top-rated')
  @ApiOperation({ summary: 'Get top rated vendors' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of vendors to return' })
  getTopRatedVendors(@Query('limit') limit?: number) {
    return this.vendorsService.getTopRated(limit);
  }

  // Admin Vendor Management Endpoints
  @Get('vendors/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending vendor verifications (Admin only)' })
  getPendingVendors() {
    return this.vendorsService.findPendingVendors();
  }

  @Put('vendors/:vendorId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve vendor (Admin only)' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  approveVendor(@Param('vendorId') vendorId: string, @CurrentUser('_id') adminId: string) {
    return this.vendorsService.approve(vendorId, adminId);
  }

  @Put('vendors/:vendorId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject vendor (Admin only)' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  rejectVendor(
    @Param('vendorId') vendorId: string,
    @CurrentUser('_id') adminId: string,
    @Body('reason') reason?: string,
  ) {
    return this.vendorsService.reject(vendorId, adminId, reason);
  }

  @Put('vendors/:vendorId/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend vendor (Admin only)' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  suspendVendor(
    @Param('vendorId') vendorId: string,
    @CurrentUser('_id') adminId: string,
    @Body('reason') reason?: string,
  ) {
    return this.vendorsService.suspend(vendorId, adminId, reason);
  }

  @Put('vendors/:vendorId/reactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivate vendor (Admin only)' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  reactivateVendor(@Param('vendorId') vendorId: string, @CurrentUser('_id') adminId: string) {
    return this.vendorsService.reactivate(vendorId, adminId);
  }

  // Vendor KYC Management Endpoints
  @Get('vendors/:vendorId/kyc-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor KYC status' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  getVendorKycStatus(@Param('vendorId') vendorId: string) {
    return this.vendorsService.getVendorKycStatus(vendorId);
  }

  @Put('vendors/:vendorId/kyc-verification')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor KYC verification status (Admin only)' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  updateVendorKycStatus(
    @Param('vendorId') vendorId: string,
    @Body() body: VendorKycUpdateDto,
    @CurrentUser('_id') adminId: string,
  ) {
    return this.vendorsService.updateVendorKycVerificationStatus(vendorId, body.status, body.notes, adminId);
  }

  @Get('vendors/kyc/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendors with pending KYC verification (Admin only)' })
  getPendingKycVerifications() {
    return this.vendorsService.getPendingKycVerifications();
  }

  @Get('vendors/kyc/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendors by KYC verification status (Admin only)' })
  @ApiParam({ name: 'status', description: 'Verification status', enum: ['pending', 'approved', 'rejected'] })
  getVendorsByKycStatus(@Param('status') status: 'pending' | 'approved' | 'rejected') {
    return this.vendorsService.getVendorsByVerificationStatus(status);
  }

  // Vendor Rating and Performance
  @Put('vendors/:vendorId/rating')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor rating (Admin only)' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  updateVendorRating(
    @Param('vendorId') vendorId: string,
    @Body() body: VendorRatingUpdateDto,
  ) {
    return this.vendorsService.updateRating(vendorId, body.rating);
  }

  // Vendor Dashboard Data
  @Get('vendors/:vendorId/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor dashboard data' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  getVendorDashboard(@Param('vendorId') vendorId: string) {
    return this.vendorsService.getDashboardData(vendorId);
  }
}