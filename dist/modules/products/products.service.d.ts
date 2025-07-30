import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { VendorsService } from '../vendors/vendors.service';
export declare class ProductsService {
    private productModel;
    private vendorsService;
    constructor(productModel: Model<ProductDocument>, vendorsService: VendorsService);
    create(userId: string, createProductDto: CreateProductDto): Promise<Product>;
    findAll(query?: any): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    findByVendor(vendorId: string): Promise<Product[]>;
    findByCurrentVendor(userId: string): Promise<Product[]>;
    update(id: string, userId: string, updateProductDto: Partial<CreateProductDto>): Promise<Product>;
    remove(id: string, userId: string): Promise<void>;
    search(searchTerm: string): Promise<Product[]>;
    getCategories(): Promise<string[]>;
    updateInventory(productId: string, quantity: number): Promise<void>;
}
