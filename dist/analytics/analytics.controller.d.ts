import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
