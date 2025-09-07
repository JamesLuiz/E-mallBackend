import { Model } from 'mongoose';
import { ProductDocument, ProductImage } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { VendorsService } from '../vendors/vendors.service';
import { FileUploadResult } from '../../common/services/pinata.service';
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
    uploadImages(productId: string, userId: string, files: Array<Express.Multer.File>): Promise<ProductDocument>;
    addProductImages(productId: string, userId: string, uploadResults: FileUploadResult[]): Promise<ProductDocument>;
    setPrimaryImage(productId: string, userId: string, imageHash: string): Promise<ProductDocument>;
    removeProductImage(productId: string, userId: string, imageHash: string): Promise<ProductDocument>;
    getProductImages(productId: string): Promise<ProductImage[]>;
    getFeatured(): Promise<ProductDocument[]>;
    getTrending(): Promise<ProductDocument[]>;
}
