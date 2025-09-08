import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor, VendorDocument, VendorKycDocuments } from './schemas/vendor.schema';
import { VendorBioDto } from './dto/vendor-bio.dto';
import { VendorCompanyDto } from './dto/vendor-company.dto';
import { VendorKycDto } from './dto/vendor-kyc.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
import { MinioService, MinioUploadResult } from '../minio/minio.service';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    private minioService: MinioService,
  ) {}

  async create(userId: string, businessName: string): Promise<VendorDocument> {
    const existingVendor = await this.vendorModel.findOne({ userId });
    if (existingVendor) {
      throw new ForbiddenException('User already has a vendor account');
    }

    const vendor = new this.vendorModel({
      userId,
      businessName,
    });
    const savedVendor = await vendor.save();
    return this.vendorModel
      .findById(savedVendor._id)
      .populate('userId', 'email profile')
      .exec();
  }

  async findAll(query?: VendorQueryDto): Promise<VendorDocument[]> {
    const filter: any = {};
    const sort: any = {};

    if (query) {
      // Search filter
      if (query.search) {
        filter.$or = [
          { businessName: { $regex: query.search, $options: 'i' } },
          { businessDescription: { $regex: query.search, $options: 'i' } },
        ];
      }

      // Verification filters
      if (query.verified !== undefined) {
        filter.verified = query.verified;
      }

      if (query.verificationStatus) {
        filter['kycDocuments.verificationStatus'] = query.verificationStatus;
      }

      // Rating filters
      if (query.minRating !== undefined) {
        filter.rating = { ...filter.rating, $gte: query.minRating };
      }

      if (query.maxRating !== undefined) {
        filter.rating = { ...filter.rating, $lte: query.maxRating };
      }

      // Location filters
      if (query.city) {
        filter.businessAddress = { $regex: query.city, $options: 'i' };
      }

      // Sorting
      if (query.sortBy) {
        sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
      } else {
        sort.createdAt = -1; // Default sort by creation date
      }
    }

    const queryBuilder = this.vendorModel
      .find(filter)
      .populate('userId', 'email profile')
      .sort(sort);

    if (query?.page && query?.limit) {
      const skip = (query.page - 1) * query.limit;
      queryBuilder.skip(skip).limit(query.limit);
    }

    return queryBuilder.exec();
  }

  async findOne(id: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel
      .findById(id)
      .populate('userId', 'email profile')
      .exec();
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async findByUserId(userId: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel
      .findOne({ userId })
      .populate('userId', 'email profile')
      .exec();
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async update(id: string, updateVendorDto: Partial<Vendor>): Promise<VendorDocument> {
    const updatedVendor = await this.vendorModel
      .findByIdAndUpdate(id, updateVendorDto, { new: true })
      .populate('userId', 'email profile')
      .exec();
    if (!updatedVendor) {
      throw new NotFoundException('Vendor not found');
    }
    return updatedVendor;
  }

  async updateByUserId(userId: string, updateVendorDto: Partial<Vendor>): Promise<VendorDocument> {
    const updatedVendor = await this.vendorModel
      .findOneAndUpdate({ userId }, updateVendorDto, { new: true })
      .populate('userId', 'email profile')
      .exec();
    if (!updatedVendor) {
      throw new NotFoundException('Vendor not found');
    }
    return updatedVendor;
  }

  async remove(id: string, adminId?: string): Promise<void> {
    const result = await this.vendorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Vendor not found');
    }
  }

  async getVerified(): Promise<VendorDocument[]> {
    return this.vendorModel
      .find({ verified: true })
      .populate('userId', 'email profile')
      .exec();
  }

  async findPendingVendors(): Promise<VendorDocument[]> {
    return this.vendorModel
      .find({ 'kycDocuments.verificationStatus': 'pending' })
      .populate('userId', 'email profile')
      .exec();
  }

  async approve(id: string, adminId?: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel
      .findByIdAndUpdate(
        id,
        { 
          verified: true,
          'kycDocuments.verificationStatus': 'approved',
          'kycDocuments.verifiedAt': new Date()
        },
        { new: true }
      )
      .populate('userId', 'email profile')
      .exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async reject(id: string, adminId?: string, reason?: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel
      .findByIdAndUpdate(
        id,
        { 
          verified: false,
          'kycDocuments.verificationStatus': 'rejected',
          'kycDocuments.verificationNotes': reason,
          'kycDocuments.verifiedAt': new Date()
        },
        { new: true }
      )
      .populate('userId', 'email profile')
      .exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async suspend(id: string, adminId?: string, reason?: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel
      .findByIdAndUpdate(
        id,
        { 
          verified: false,
          // Add suspension fields if needed
        },
        { new: true }
      )
      .populate('userId', 'email profile')
      .exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async reactivate(id: string, adminId?: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel
      .findByIdAndUpdate(
        id,
        { 
          verified: true,
          // Remove suspension fields if needed
        },
        { new: true }
      )
      .populate('userId', 'email profile')
      .exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async getTopRated(limit: number = 10): Promise<VendorDocument[]> {
    return this.vendorModel
      .find({ verified: true })
      .sort({ rating: -1 })
      .limit(limit)
      .populate('userId', 'email profile')
      .exec();
  }

  async updateRating(vendorId: string, newRating: number): Promise<VendorDocument> {
    const vendor = await this.vendorModel.findByIdAndUpdate(
      vendorId,
      { rating: newRating },
      { new: true },
    );
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async getDashboardData(userId: string) {
    const vendor = await this.findByUserId(userId);
    
    // Mock dashboard data - in real implementation, fetch from products/orders
    return {
      vendor,
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageRating: vendor.rating,
      },
      recentOrders: [],
      salesChart: [],
    };
  }

  async getAnalytics(userId: string, period?: string) {
    const vendor = await this.findByUserId(userId);
    
    // Mock analytics data
    return {
      vendor,
      period: period || 'month',
      analytics: {
        salesOvertime: [],
        topProducts: [],
        customerInsights: [],
        revenueBreakdown: [],
      },
    };
  }

  async getVendorProducts(vendorId: string, query: { page?: number; limit?: number; status?: string; category?: string }) {
    // TODO: Integrate with products service/model
    // For now, return mock data
    return {
      vendorId,
      products: [],
      pagination: { page: query.page || 1, limit: query.limit || 10, total: 0 },
    };
  }

  async kycBioData(userId: string, bioDto: VendorBioDto) {
    const vendor = await this.vendorModel.findOneAndUpdate(
      { userId },
      { $set: { bioData: bioDto } },
      { new: true },
    );
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async kycCompanyInfo(userId: string, companyDto: VendorCompanyDto) {
    const vendor = await this.vendorModel.findOneAndUpdate(
      { userId },
      { $set: { companyInfo: companyDto } },
      { new: true },
    );
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async kycDocuments(userId: string, files: Array<Express.Multer.File>, kycDto: VendorKycDto) {
    // TODO: Integrate with uploads service/cloud storage
    // For now, just mock file URLs
    const fileUrls = files.map(f => `uploads/kyc/${f.filename || f.originalname}`);
    const vendor = await this.vendorModel.findOneAndUpdate(
      { userId },
      { $set: { kycDocuments: { ...kycDto, files: fileUrls } } },
      { new: true },
    );
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  // New methods for Pinata integration

  async updateVendorLogo(userId: string, uploadResult: MinioUploadResult): Promise<VendorDocument> {
    const vendor = await this.vendorModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          'storeSettings.logoUri': uploadResult.uri,
          'storeSettings.logoHash': uploadResult.hash,
          'storeSettings.logo': uploadResult.uri, // Keep legacy field for backward compatibility
        },
      },
      { new: true, runValidators: true }
    ).populate('userId', 'email profile').exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async updateVendorBanner(userId: string, uploadResult: MinioUploadResult): Promise<VendorDocument> {
    const vendor = await this.vendorModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          'storeSettings.bannerUri': uploadResult.uri,
          'storeSettings.bannerHash': uploadResult.hash,
          'storeSettings.banner': uploadResult.uri, // Keep legacy field for backward compatibility
        },
      },
      { new: true, runValidators: true }
    ).populate('userId', 'email profile').exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async uploadVendorKycDocument(
    userId: string,
    documentType: 'identity' | 'businessCertificate' | 'taxCertificate' | 'bankStatement',
    uploadResult: MinioUploadResult
  ): Promise<VendorDocument> {
    const updateData: any = {
      'kycDocuments.submittedAt': new Date(),
      'kycDocuments.verificationStatus': 'pending',
    };

    switch (documentType) {
      case 'identity':
        updateData['kycDocuments.identityDocumentUri'] = uploadResult.uri;
        updateData['kycDocuments.identityDocumentHash'] = uploadResult.hash;
        break;
      case 'businessCertificate':
        updateData['kycDocuments.businessCertificateUri'] = uploadResult.uri;
        updateData['kycDocuments.businessCertificateHash'] = uploadResult.hash;
        break;
      case 'taxCertificate':
        updateData['kycDocuments.taxCertificateUri'] = uploadResult.uri;
        updateData['kycDocuments.taxCertificateHash'] = uploadResult.hash;
        break;
      case 'bankStatement':
        updateData['kycDocuments.bankStatementUri'] = uploadResult.uri;
        updateData['kycDocuments.bankStatementHash'] = uploadResult.hash;
        break;
    }

    const vendor = await this.vendorModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'email profile').exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async updateVendorKycDocumentType(userId: string, documentType: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel.findOneAndUpdate(
      { userId },
      { $set: { 'kycDocuments.identityDocumentType': documentType } },
      { new: true, runValidators: true }
    ).populate('userId', 'email profile').exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async updateVendorKycVerificationStatus(
    userId: string,
    status: 'pending' | 'approved' | 'rejected',
    notes?: string,
    verifiedBy?: string
  ): Promise<VendorDocument> {
    const updateData: any = {
      'kycDocuments.verificationStatus': status,
      'kycDocuments.verificationNotes': notes,
    };

    if (status === 'approved' || status === 'rejected') {
      updateData['kycDocuments.verifiedAt'] = new Date();
      updateData['kycDocuments.verifiedBy'] = verifiedBy;
    }

    // If approved, also mark vendor as verified
    if (status === 'approved') {
      updateData['verified'] = true;
    }

    const vendor = await this.vendorModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'email profile').exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async getVendorKycStatus(userId: string): Promise<VendorKycDocuments | null> {
    const vendor = await this.vendorModel.findOne({ userId }).select('kycDocuments').exec();
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor.kycDocuments || null;
  }

  async getPendingKycVerifications(): Promise<VendorDocument[]> {
    return this.vendorModel
      .find({ 'kycDocuments.verificationStatus': 'pending' })
      .populate('userId', 'email profile')
      .exec();
  }

  async getVendorsByVerificationStatus(status: 'pending' | 'approved' | 'rejected'): Promise<VendorDocument[]> {
    return this.vendorModel
      .find({ 'kycDocuments.verificationStatus': status })
      .populate('userId', 'email profile')
      .exec();
  }

  async uploadLogo(userId: string, file: Express.Multer.File) {
    const vendor = await this.findByUserId(userId);
    const { uri, hash } = await this.minioService.uploadFile(file, 'vendors');
    vendor.storeSettings.logo = uri;
    vendor.storeSettings.logoUri = uri;
    vendor.storeSettings.logoHash = hash;
    await vendor.save();
    return vendor;
  }

  async uploadKycDocument(userId: string, file: Express.Multer.File, type: string) {
    const vendor = await this.findByUserId(userId);
    const { uri, hash } = await this.minioService.uploadFile(file, 'vendors');
    if (!vendor.kycDocuments) vendor.kycDocuments = {} as any;
    if (type === 'identity') {
      vendor.kycDocuments.identityDocumentUri = uri;
      vendor.kycDocuments.identityDocumentHash = hash;
    } else if (type === 'businessCertificate') {
      vendor.kycDocuments.businessCertificateUri = uri;
      vendor.kycDocuments.businessCertificateHash = hash;
    }
    await vendor.save();
    return vendor;
  }
}