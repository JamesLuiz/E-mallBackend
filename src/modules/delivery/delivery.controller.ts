import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeliveryService } from './delivery.service';

@ApiTags('Delivery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('calculate-cost')
  @ApiOperation({ summary: 'Calculate delivery cost' })
  calculateCost(
    @Body('origin') origin: string,
    @Body('destination') destination: string,
    @Body('weight') weight: number,
  ) {
    return this.deliveryService.calculateCost(origin, destination, weight);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign delivery partner' })
  assignDelivery(
    @Body('orderId') orderId: string,
    @Body('partnerId') partnerId: string,
  ) {
    return this.deliveryService.assignDelivery(orderId, partnerId);
  }

  @Get('track/:orderId')
  @ApiOperation({ summary: 'Track delivery' })
  trackDelivery(@Param('orderId') orderId: string) {
    return this.deliveryService.trackDelivery(orderId);
  }

  @Put('update-status')
  @ApiOperation({ summary: 'Update delivery status' })
  updateStatus(
    @Body('deliveryId') deliveryId: string,
    @Body('status') status: string,
  ) {
    return this.deliveryService.updateDeliveryStatus(deliveryId, status);
  }
}