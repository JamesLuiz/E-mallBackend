import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument, ProductImage } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { VendorsService } from '../vendors/vendors.service';
import { FileUploadResult } from '../../common/services/pinata.service';

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

  // New method for Pinata image uploads
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

    // Convert upload results to ProductImage objects
    const productImages: ProductImage[] = uploadResults.map(result => ({
      uri: result.uri,
      hash: result.hash,
      originalName: result.originalName,
      isPrimary: false,
      uploadedAt: new Date(),
    }));

    // If this is the first image, make it primary
    if (!product.imageUris || product.imageUris.length === 0) {
      productImages[0].isPrimary = true;
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        productId,
        {
          $push: { imageUris: { $each: productImages } },
          $addToSet: { images: { $each: uploadResults.map(r => r.uri) } }, // Keep legacy field updated
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

    // Set all images to non-primary first, then set the selected one as primary
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

  async getFeatured(): Promise<ProductDocument[]> {
    // TODO: Implement real featured logic
    return this.productModel.find({ featured: true, isActive: true }).exec();
  }

  async getTrending(): Promise<ProductDocument[]> {
    // TODO: Implement real trending logic
    return this.productModel.find({ isActive: true }).sort({ sales: -1 }).limit(10).exec();
  }
}