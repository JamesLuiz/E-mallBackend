import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize payment' })
  initializePayment(
    @CurrentUser('_id') userId: string,
    @Body('amount') amount: number,
    @Body('orderId') orderId: string,
  ) {
    return this.paymentsService.initializePayment(userId, amount, orderId);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify payment' })
  verifyPayment(@Body('reference') reference: string) {
    return this.paymentsService.verifyPayment(reference);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history' })
  getHistory(@CurrentUser('_id') userId: string) {
    return this.paymentsService.getPaymentHistory(userId);
  }

  @Post('refund')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Process refund' })
  processRefund(
    @Body('paymentId') paymentId: string,
    @Body('amount') amount: number,
  ) {
    return this.paymentsService.processRefund(paymentId, amount);
  }

  @Get('vendor/payouts')
  @UseGuards(RolesGuard)
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get vendor payouts' })
  getVendorPayouts(@CurrentUser('_id') userId: string) {
    return this.paymentsService.getVendorPayouts(userId);
  }
}