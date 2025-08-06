import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDashboard(query);
  }

  @Get('sales')
  async getSales(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSales(query);
  }

  @Get('products')
  async getProducts(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getProducts(query);
  }

  @Get('customers')
  async getCustomers(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getCustomers(query);
  }
}
