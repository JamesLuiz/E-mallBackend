import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<import("./schemas/product.schema").Product[]>;
    create(userId: string, createProductDto: CreateProductDto): Promise<import("./schemas/product.schema").Product>;
    getCategories(): Promise<string[]>;
    search(searchTerm: string): Promise<import("./schemas/product.schema").Product[]>;
    getMyProducts(userId: string): Promise<import("./schemas/product.schema").Product[]>;
    getVendorProducts(vendorId: string): Promise<import("./schemas/product.schema").Product[]>;
    findOne(id: string): Promise<import("./schemas/product.schema").Product>;
    update(id: string, userId: string, updateProductDto: Partial<CreateProductDto>): Promise<import("./schemas/product.schema").Product>;
    remove(id: string, userId: string): Promise<void>;
}
