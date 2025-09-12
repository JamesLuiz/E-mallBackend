import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAssistantController } from './ai-assistant.controller';
import { AiAssistantService } from './ai-assistant.service';
import { ChatSession, ChatSessionSchema } from './schemas/chat-session.schema';
import { ProductsModule } from '../products/products.module';
import { VendorsModule } from '../modules/vendors/vendors.module';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatSession.name, schema: ChatSessionSchema }
    ]),
    ProductsModule,
    VendorsModule,
    UsersModule,
  ],
  controllers: [AiAssistantController],
  providers: [AiAssistantService],
  exports: [AiAssistantService],
})
export class AiAssistantModule {}