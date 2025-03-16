import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OptionPayloadDto } from '../../../dto/api-response.dto';
import { PaginationDto } from '../../../dto/pagination.dto';
import { StatusType } from '../../../types/all-data-types.type';

export class AddBlogDto {

  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  slug: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  shortDesc: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bannerImage: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'publish',
  })
  status?: StatusType;

  @IsOptional()
  @ApiProperty()
  priority: number;

  @IsOptional()
  @ApiProperty()
  formType: string;

  @IsOptional()
  @ApiProperty()
  category: any;
}

export class InsertManyBlogDto {
  @Type(() => AddBlogDto)
  @ApiProperty({ type: () => [AddBlogDto] })
  data: AddBlogDto[];

  @ApiProperty()
  option: OptionPayloadDto;
}

export class FilterBlogDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: 'draft' | 'publish';
}

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  slug: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  shortDesc: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bannerImage: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'publish',
  })
  status?: 'draft' | 'publish';

  @IsOptional()
  @ApiProperty()
  priority: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ApiProperty()
  ids: string[];


  @IsOptional()
  @ApiProperty()
  formType: string;

  @IsOptional()
  @ApiProperty()
  category: any;
}

export class FilterAndPaginationBlogDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterBlogDto)
  @ApiProperty()
  filter: FilterBlogDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  @ApiProperty()
  pagination: PaginationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ApiProperty({ example: { createdAt: -1 } })
  sort: object;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ApiProperty({ example: { name: 1 } })
  select: any;
}
