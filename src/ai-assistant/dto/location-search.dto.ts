import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LocationSearchDto {
  @ApiProperty({ description: 'Location to search for vendors/products' })
  @IsString()
  location: string;

  @ApiProperty({ required: false, description: 'Search radius in kilometers', default: 50 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(200)
  radius?: number;

  @ApiProperty({ required: false, description: 'Product search query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ required: false, description: 'Maximum number of results', default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;
}