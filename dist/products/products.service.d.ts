import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';
import { VendorsService } from '../vendors/vendors.service';
import { PinataService } from '../uploads/pinata.service';
export declare class ProductsService {
    private productModel;
    private vendorsService;
    private pinataService;
    constructor(productModel: Model<ProductDocument>, vendorsService: VendorsService, pinataService: PinataService);
    uploadImages(productId: string, userId: string, files: Array<Express.Multer.File>): Promise<any>;
}
