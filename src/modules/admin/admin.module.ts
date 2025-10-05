import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { VendorsModule } from '../vendors/vendors.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../../products/products.module';

@Module({
  imports: [VendorsModule, OrdersModule, ProductsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}