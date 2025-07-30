import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor, VendorDocument } from './schemas/vendor.schema';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
  ) {}

  async create(userId: string, createVendorDto: CreateVendorDto): Promise<Vendor> {
    // Check if user already has a vendor profile
    const existingVendor = await this.vendorModel.findOne({ userId });
    if (existingVendor) {
      throw new ForbiddenException('User already has a vendor profile');
    }

    const createdVendor = new this.vendorModel({
      userId,
      ...createVendorDto,
    });
    return createdVendor.save();
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorModel.find({ verified: true }).populate('userId', 'email profile').exec();
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorModel.findById(id).populate('userId', 'email profile').exec();
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async findByUserId(userId: string): Promise<Vendor> {
    const vendor = await this.vendorModel.findOne({ userId }).populate('userId', 'email profile').exec();
    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }
    return vendor;
  }

  async update(id: string, updateVendorDto: Partial<CreateVendorDto>): Promise<Vendor> {
    const updatedVendor = await this.vendorModel
      .findByIdAndUpdate(id, updateVendorDto, { new: true, runValidators: true })
      .populate('userId', 'email profile')
      .exec();

    if (!updatedVendor) {
      throw new NotFoundException('Vendor not found');
    }
    return updatedVendor;
  }

  async approve(id: string): Promise<Vendor> {
    const vendor = await this.vendorModel
      .findByIdAndUpdate(id, { verified: true }, { new: true })
      .exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
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

  async getAnalytics(userId: string) {
    const vendor = await this.findByUserId(userId);
    
    // Mock analytics data
    return {
      vendor,
      analytics: {
        salesOvertime: [],
        topProducts: [],
        customerInsights: [],
        revenueBreakdown: [],
      },
    };
  }
}