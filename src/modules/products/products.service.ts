import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private vendorsService: VendorsService,
  ) {}

  async create(userId: string, createProductDto: CreateProductDto): Promise<ProductDocument> {
    // Get vendor profile to ensure user is a vendor
    const vendor = await this.vendorsService.findByUserId(userId);
    
    const createdProduct = new this.productModel({
      vendorId: vendor._id,
      ...createProductDto,
    });
    return createdProduct.save();
  }

  async findAll(query: any = {}): Promise<ProductDocument[]> {
    const filter = { isActive: true, ...query };
    return this.productModel
      .find(filter)
      .populate('vendorId', 'businessName storeSettings')
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

  async findByVendor(vendorId: string): Promise<ProductDocument[]> {
    return this.productModel
      .find({ vendorId, isActive: true })
      .populate('vendorId', 'businessName')
      .exec();
  }

  async findByCurrentVendor(userId: string): Promise<ProductDocument[]> {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.productModel.find({ vendorId: vendor._id }).exec();
  }

  async update(id: string, userId: string, updateProductDto: Partial<CreateProductDto>): Promise<ProductDocument> {
    const product = await this.findOne(id);
    const vendor = await this.vendorsService.findByUserId(userId);
    
    // Check if the product belongs to the current vendor
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
    
    // Check if the product belongs to the current vendor
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.productModel.findByIdAndUpdate(id, { isActive: false }).exec();
  }

  async search(searchTerm: string): Promise<ProductDocument[]> {
    return this.productModel
      .find({
        isActive: true,
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } },
        ],
      })
      .populate('vendorId', 'businessName storeSettings')
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

  async uploadImages(productId: string, userId: string, files: Array<Express.Multer.File>) {
    // TODO: Integrate with uploads service/cloud storage
    // For now, just mock file URLs
    const imageUrls = files.map(f => `uploads/products/${f.filename || f.originalname}`);
    const product = await this.findOne(productId);
    const vendor = await this.vendorsService.findByUserId(userId);
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only update your own products');
    }
    product.images = [...(product.images || []), ...imageUrls];
    await product.save();
    return product;
  }

  async getFeatured(): Promise<ProductDocument[]> {
    // TODO: Implement real featured logic
    return this.productModel.find({ featured: true, isActive: true }).exec();
  }

  async getTrending(): Promise<ProductDocument[]> {
    // TODO: Implement real trending logic
    return this.productModel.find({ isActive: true }).sort({ sales: -1 }).limit(10).exec();
  }
}