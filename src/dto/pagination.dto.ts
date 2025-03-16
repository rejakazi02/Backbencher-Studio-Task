import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  pageSize: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  currentPage: number;
}
