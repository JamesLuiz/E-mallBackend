import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { VendorsService } from '../vendors/vendors.service';
import { PinataService } from '../uploads/pinata.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private vendorsService: VendorsService,
    private pinataService: PinataService,
  ) {}

  // ...existing methods...

  async uploadImages(productId: string, userId: string, files: Array<Express.Multer.File>) {
    const product = await this.findOne(productId);
    const vendor = await this.vendorsService.findByUserId(userId);
    if (product.vendorId.toString() !== vendor._id.toString()) {
      throw new ForbiddenException('You can only update your own products');
    }
    // Upload to Pinata
    const imageResults = await Promise.all(files.map(file => this.pinataService.uploadFile(file)));
    const imageUris = imageResults.map(r => r.uri);
    product.images = [...(product.images || []), ...imageUris];
    await product.save();
    return product;
  }
}