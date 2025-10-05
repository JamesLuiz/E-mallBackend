import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductSearchDto {
  @ApiProperty({ description: 'Search query for products' })
  @IsString()
  query: string;

  @ApiProperty({ required: false, description: 'Product category to search in' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, description: 'Maximum number of results', default: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiProperty({ required: false, description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'rating' | 'name' | 'createdAt';

  @ApiProperty({ required: false, description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}