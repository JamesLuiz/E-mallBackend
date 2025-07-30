import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { VendorsService } from '../vendors/vendors.service';
export declare class ProductsService {
    private productModel;
    private vendorsService;
    constructor(productModel: Model<ProductDocument>, vendorsService: VendorsService);
    create(userId: string, createProductDto: CreateProductDto): Promise<ProductDocument>;
    findAll(query?: any): Promise<ProductDocument[]>;
    findOne(id: string): Promise<ProductDocument>;
    findByVendor(vendorId: string): Promise<ProductDocument[]>;
    findByCurrentVendor(userId: string): Promise<ProductDocument[]>;
    update(id: string, userId: string, updateProductDto: Partial<CreateProductDto>): Promise<ProductDocument>;
    remove(id: string, userId: string): Promise<void>;
    search(searchTerm: string): Promise<ProductDocument[]>;
    getCategories(): Promise<string[]>;
    updateInventory(productId: string, quantity: number): Promise<void>;
}
