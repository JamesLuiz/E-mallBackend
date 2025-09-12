import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SupportQueryDto {
  @ApiProperty({ description: 'Support question or issue description' })
  @IsString()
  query: string;

  @ApiProperty({ 
    required: false, 
    description: 'Support category',
    enum: ['order', 'payment', 'shipping', 'account', 'vendor', 'general']
  })
  @IsOptional()
  @IsString()
  category?: 'order' | 'payment' | 'shipping' | 'account' | 'vendor' | 'general';

  @ApiProperty({ required: false, description: 'Priority level', enum: ['low', 'medium', 'high'] })
  @IsOptional()
  @IsString()
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({ required: false, description: 'User contact preference' })
  @IsOptional()
  @IsString()
  contactPreference?: 'email' | 'phone' | 'chat';
}