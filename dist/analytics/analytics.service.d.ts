import { Model } from 'mongoose';
import { AnalyticsDocument } from './schemas/analytics.schema';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
export declare class AnalyticsService {
    private analyticsModel;
    constructor(analyticsModel: Model<AnalyticsDocument>);
    getDashboard(query: AnalyticsQueryDto): Promise<{
        message: string;
        query: AnalyticsQueryDto;
    }>;
    getSales(query: AnalyticsQueryDto): Promise<{
        message: string;
        query: AnalyticsQueryDto;
    }>;
    getProducts(query: AnalyticsQueryDto): Promise<{
        message: string;
        query: AnalyticsQueryDto;
    }>;
    getCustomers(query: AnalyticsQueryDto): Promise<{
        message: string;
        query: AnalyticsQueryDto;
    }>;
}
