import { Model } from 'mongoose';
import { Vendor, VendorDocument, VendorKycDocuments } from './schemas/vendor.schema';
import { VendorBioDto } from './dto/vendor-bio.dto';
import { VendorCompanyDto } from './dto/vendor-company.dto';
import { VendorKycDto } from './dto/vendor-kyc.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
import { FileUploadResult } from '../../common/services/pinata.service';
export declare class VendorsService {
    private vendorModel;
    constructor(vendorModel: Model<VendorDocument>);
    create(userId: string, businessName: string): Promise<VendorDocument>;
    findAll(query?: VendorQueryDto): Promise<VendorDocument[]>;
    findOne(id: string): Promise<VendorDocument>;
    findByUserId(userId: string): Promise<VendorDocument>;
    update(id: string, updateVendorDto: Partial<Vendor>): Promise<VendorDocument>;
    updateByUserId(userId: string, updateVendorDto: Partial<Vendor>): Promise<VendorDocument>;
    remove(id: string, adminId?: string): Promise<void>;
    getVerified(): Promise<VendorDocument[]>;
    findPendingVendors(): Promise<VendorDocument[]>;
    approve(id: string, adminId?: string): Promise<VendorDocument>;
    reject(id: string, adminId?: string, reason?: string): Promise<VendorDocument>;
    suspend(id: string, adminId?: string, reason?: string): Promise<VendorDocument>;
    reactivate(id: string, adminId?: string): Promise<VendorDocument>;
    getTopRated(limit?: number): Promise<VendorDocument[]>;
    updateRating(vendorId: string, newRating: number): Promise<VendorDocument>;
    getDashboardData(userId: string): Promise<{
        vendor: VendorDocument;
        stats: {
            totalProducts: number;
            totalOrders: number;
            totalRevenue: number;
            averageRating: number;
        };
        recentOrders: any[];
        salesChart: any[];
    }>;
    getAnalytics(userId: string, period?: string): Promise<{
        vendor: VendorDocument;
        period: string;
        analytics: {
            salesOvertime: any[];
            topProducts: any[];
            customerInsights: any[];
            revenueBreakdown: any[];
        };
    }>;
    getVendorProducts(vendorId: string, query: {
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
    }): Promise<{
        vendorId: string;
        products: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    kycBioData(userId: string, bioDto: VendorBioDto): Promise<import("mongoose").Document<unknown, {}, VendorDocument> & Vendor & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    kycCompanyInfo(userId: string, companyDto: VendorCompanyDto): Promise<import("mongoose").Document<unknown, {}, VendorDocument> & Vendor & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    kycDocuments(userId: string, files: Array<Express.Multer.File>, kycDto: VendorKycDto): Promise<import("mongoose").Document<unknown, {}, VendorDocument> & Vendor & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateVendorLogo(userId: string, uploadResult: FileUploadResult): Promise<VendorDocument>;
    updateVendorBanner(userId: string, uploadResult: FileUploadResult): Promise<VendorDocument>;
    uploadVendorKycDocument(userId: string, documentType: 'identity' | 'businessCertificate' | 'taxCertificate' | 'bankStatement', uploadResult: FileUploadResult): Promise<VendorDocument>;
    updateVendorKycDocumentType(userId: string, documentType: string): Promise<VendorDocument>;
    updateVendorKycVerificationStatus(userId: string, status: 'pending' | 'approved' | 'rejected', notes?: string, verifiedBy?: string): Promise<VendorDocument>;
    getVendorKycStatus(userId: string): Promise<VendorKycDocuments | null>;
    getPendingKycVerifications(): Promise<VendorDocument[]>;
    getVendorsByVerificationStatus(status: 'pending' | 'approved' | 'rejected'): Promise<VendorDocument[]>;
}
