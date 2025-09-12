import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PriceRangeSearchDto {
  @ApiProperty({ description: 'Minimum price in Naira' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice: number;

  @ApiProperty({ description: 'Maximum price in Naira' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxPrice: number;

  @ApiProperty({ required: false, description: 'Product category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, description: 'Additional search query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ required: false, description: 'Maximum number of results', default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}