import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument, ProductImage } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { VendorsService } from '../vendors/vendors.service';
import { PinataService } from '../uploads/pinata.service';
import { FileUploadResult } from '../../common/services/pinata.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private vendorsService: VendorsService,
    private pinataService: PinataService,
  ) {}

  async create(userId: string, createProductDto: CreateProductDto): Promise<ProductDocument> {
    const vendor = await this.vendorsService.findByUserId(userId);
    
    const createdProduct = new this.productModel({
      vendorId: vendor._id,
      ...createProductDto,
    });
    return createdProduct.save();
  }

  async findAll(filter: ProductFilterDto = {}): Promise<ProductDocument[]> {
    const query: any = { isActive: true };
    
    if (filter.category) query.category = filter.category;
    if (filter.vendor) query.vendorId = filter.vendor;
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filter.search, 'i')] } },
      ];
    }
    if (filter.minPrice) query.price = { $gte: filter.minPrice };
    if (filter.maxPrice) {
      query.price = { ...query.price, $lte: filter.maxPrice };
    }
    if (filter.status) query.status = filter.status;

    const page = filter.page || 1;
    const limit = filter.limit || 20;

    return this.productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findOne({ _id: id, isActive: true })
      .populate('vendorId', 'businessName storeSettings rating')
      .exec();
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findByVendor(vendorId: string, filter: ProductFilterDto = {}): Promise<ProductDocument[]> {
    const query: any = { vendorId, isActive: true };
    
    if (filter.category) query.category = filter.category;
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
      ];
    }
    if (filter.status) query.status = filter.status;

    const page = filter.page || 1;
    const limit = filter.limit || 20;

    return this.productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('vendorId', 'businessName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCurrentVendor(userId: string, filter: ProductFilterDto = {}): Promise<ProductDocument[]> {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.findByVendor(vendor._id.toString(), filter);
  }

  async update(id: string, userId: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.findOne(id);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true, runValidators: true })
      .populate('vendorId', 'businessName storeSettings')
      .exec();

    return updatedProduct;
  }

  async remove(id: string, userId: string): Promise<void> {
    const product = await this.findOne(id);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.productModel.findByIdAndUpdate(id, { isActive: false }).exec();
  }

  async search(searchTerm: string, filter: ProductFilterDto = {}): Promise<ProductDocument[]> {
    const query: any = {
      isActive: true,
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } },
      ],
    };

    if (filter.category) query.category = filter.category;
    if (filter.minPrice) query.price = { $gte: filter.minPrice };
    if (filter.maxPrice) {
      query.price = { ...query.price, $lte: filter.maxPrice };
    }

    const page = filter.page || 1;
    const limit = filter.limit || 20;

    return this.productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getCategories(): Promise<string[]> {
    return this.productModel.distinct('category', { isActive: true }).exec();
  }

  async updateInventory(productId: string, quantity: number): Promise<void> {
    await this.productModel.findByIdAndUpdate(
      productId,
      { $inc: { 'inventory.stock': -quantity } },
    ).exec();
  }

  async uploadImages(productId: string, userId: string, files: Array<Express.Multer.File>): Promise<ProductDocument> {
    const product = await this.findOne(productId);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only update your own products');
    }

    const imageResults = await Promise.all(files.map(file => this.pinataService.uploadFile(file)));
    const imageUris = imageResults.map(r => r.uri);
    product.images = [...(product.images || []), ...imageUris];
    await product.save();
    return product;
  }

  async addProductImages(
    productId: string,
    userId: string,
    uploadResults: FileUploadResult[]
  ): Promise<ProductDocument> {
    const product = await this.findOne(productId);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only update your own products');
    }

    const productImages: ProductImage[] = uploadResults.map(result => ({
      uri: result.uri,
      hash: result.hash,
      originalName: result.originalName,
      isPrimary: false,
      uploadedAt: new Date(),
    }));

    if (!product.imageUris || product.imageUris.length === 0) {
      productImages[0].isPrimary = true;
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        productId,
        {
          $push: { imageUris: { $each: productImages } },
          $addToSet: { images: { $each: uploadResults.map(r => r.uri) } },
        },
        { new: true, runValidators: true }
      )
      .populate('vendorId', 'businessName storeSettings')
      .exec();

    return updatedProduct;
  }

  async setPrimaryImage(productId: string, userId: string, imageHash: string): Promise<ProductDocument> {
    const product = await this.findOne(productId);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only update your own products');
    }

    await this.productModel.updateOne(
      { _id: productId },
      { $set: { 'imageUris.$[].isPrimary': false } }
    );

    const updatedProduct = await this.productModel
      .findOneAndUpdate(
        { _id: productId, 'imageUris.hash': imageHash },
        { $set: { 'imageUris.$.isPrimary': true } },
        { new: true, runValidators: true }
      )
      .populate('vendorId', 'businessName storeSettings')
      .exec();

    return updatedProduct;
  }

  async removeProductImage(productId: string, userId: string, imageHash: string): Promise<ProductDocument> {
    const product = await this.findOne(productId);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        productId,
        {
          $pull: { 
            imageUris: { hash: imageHash },
            images: { $in: [product.imageUris?.find(img => img.hash === imageHash)?.uri] }
          }
        },
        { new: true, runValidators: true }
      )
      .populate('vendorId', 'businessName storeSettings')
      .exec();

    return updatedProduct;
  }

  async getProductImages(productId: string): Promise<ProductImage[]> {
    const product = await this.productModel.findById(productId).select('imageUris').exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product.imageUris || [];
  }

  async getFeatured(limit: number = 10): Promise<ProductDocument[]> {
    return this.productModel
      .find({ featured: true, isActive: true })
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTrending(limit: number = 10): Promise<ProductDocument[]> {
    return this.productModel
      .find({ isActive: true })
      .sort({ sales: -1, views: -1 })
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .exec();
  }

  async getNewArrivals(limit: number = 10): Promise<ProductDocument[]> {
    return this.productModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .exec();
  }

  async getTopRated(limit: number = 10): Promise<ProductDocument[]> {
    return this.productModel
      .find({ isActive: true, rating: { $gte: 4 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .exec();
  }

  async getOnSale(limit: number = 20): Promise<ProductDocument[]> {
    return this.productModel
      .find({ 
        isActive: true, 
        discount: { $gt: 0 } 
      })
      .sort({ discount: -1 })
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .exec();
  }

  async getByCategory(category: string, filter: ProductFilterDto = {}): Promise<ProductDocument[]> {
    const query: any = { category, isActive: true };
    
    if (filter.minPrice) query.price = { $gte: filter.minPrice };
    if (filter.maxPrice) {
      query.price = { ...query.price, $lte: filter.maxPrice };
    }
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
      ];
    }

    const page = filter.page || 1;
    const limit = filter.limit || 20;

    return this.productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .sort({ createdAt: -1 })
      .exec();
  }

  async incrementViews(productId: string): Promise<void> {
    await this.productModel.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } }
    ).exec();
  }

  async updateRating(productId: string, newRating: number, reviewCount: number): Promise<ProductDocument> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        productId,
        { 
          rating: newRating,
          reviewCount: reviewCount 
        },
        { new: true }
      )
      .populate('vendorId', 'businessName storeSettings')
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return updatedProduct;
  }

  async getRelatedProducts(productId: string, limit: number = 5): Promise<ProductDocument[]> {
    const product = await this.findOne(productId);
    
    return this.productModel
      .find({
        _id: { $ne: productId },
        category: product.category,
        isActive: true
      })
      .limit(limit)
      .populate('vendorId', 'businessName storeSettings')
      .sort({ rating: -1 })
      .exec();
  }

  async getProductStats(productId: string): Promise<any> {
    const product = await this.findOne(productId);
    
    return {
      views: product.views || 0,
      sales: product.sales || 0,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      stockLevel: product.inventory.stock,
      isLowStock: product.inventory.stock <= (product.inventory.lowStockAlert || 10),
    };
  }

  async toggleFeatured(productId: string, userId: string): Promise<ProductDocument> {
    const product = await this.findOne(productId);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        productId,
        { featured: !product.featured },
        { new: true }
      )
      .populate('vendorId', 'businessName storeSettings')
      .exec();

    return updatedProduct;
  }

  async bulkUpdateStatus(productIds: string[], status: string, userId: string): Promise<{ updated: number }> {
    const vendor = await this.vendorsService.findByUserId(userId);
    
    const result = await this.productModel.updateMany(
      { 
        _id: { $in: productIds },
        vendorId: vendor._id 
      },
      { status }
    ).exec();

    return { updated: result.modifiedCount };
  }

  async getVendorProductStats(userId: string): Promise<any> {
    const vendor = await this.vendorsService.findByUserId(userId);
    
    const stats = await this.productModel.aggregate([
      { $match: { vendorId: vendor._id } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          totalViews: { $sum: '$views' },
          totalSales: { $sum: '$sales' },
          averageRating: { $avg: '$rating' },
          totalStock: { $sum: '$inventory.stock' },
          lowStockProducts: { 
            $sum: { 
              $cond: [
                { $lte: ['$inventory.stock', '$inventory.lowStockAlert'] }, 
                1, 
                0
              ] 
            } 
          }
        }
      }
    ]);

    return stats[0] || {
      totalProducts: 0,
      activeProducts: 0,
      totalViews: 0,
      totalSales: 0,
      averageRating: 0,
      totalStock: 0,
      lowStockProducts: 0,
    };
  }

  async getLowStockProducts(userId: string): Promise<ProductDocument[]> {
    const vendor = await this.vendorsService.findByUserId(userId);
    
    return this.productModel
      .find({
        vendorId: vendor._id,
        isActive: true,
        $expr: { $lte: ['$inventory.stock', '$inventory.lowStockAlert'] }
      })
      .populate('vendorId', 'businessName')
      .sort({ 'inventory.stock': 1 })
      .exec();
  }

  async duplicateProduct(productId: string, userId: string): Promise<ProductDocument> {
    const originalProduct = await this.findOne(productId);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    if (originalProduct.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only duplicate your own products');
    }

    const productData = originalProduct.toObject();
    delete productData._id;
    delete productData.createdAt;
    delete productData.updatedAt;
    
    productData.name = `${productData.name} (Copy)`;
    productData.isActive = false; // Start as draft

    const duplicatedProduct = new this.productModel(productData);
    return duplicatedProduct.save();
  }
}