import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<import("./schemas/product.schema").ProductDocument[]>;
    create(userId: string, createProductDto: CreateProductDto): Promise<import("./schemas/product.schema").ProductDocument>;
    getCategories(): Promise<string[]>;
    search(searchTerm: string): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getMyProducts(userId: string): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getVendorProducts(vendorId: string): Promise<import("./schemas/product.schema").ProductDocument[]>;
    findOne(id: string): Promise<import("./schemas/product.schema").ProductDocument>;
    update(id: string, userId: string, updateProductDto: Partial<CreateProductDto>): Promise<import("./schemas/product.schema").ProductDocument>;
    remove(id: string, userId: string): Promise<void>;
}
