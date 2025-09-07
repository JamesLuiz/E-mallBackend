import { IsArray, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUpdateStatusDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @ApiProperty({ enum: ['draft', 'active', 'inactive', 'out_of_stock'] })
  @IsEnum(['draft', 'active', 'inactive', 'out_of_stock'])
  status: string;
}