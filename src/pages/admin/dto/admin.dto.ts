import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AdminRoles } from '../../../enum/admin-roles.enum';
import { GenderTypes } from '../../../enum/gender-types.enum';
import { PaginationDto } from '../../../dto/pagination.dto';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Reja', required: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({ example: 'superadmin', required: true })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({ example: '123456', required: true })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR])
  @ApiProperty({
    example: 'super_admin',
    required: true,
  })
  role: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ApiProperty({
    example: ['create', 'edit', 'delete', 'get'],
  })
  permissions: string[];

  @IsOptional()
  @IsString()
  @IsIn([GenderTypes.MALE, GenderTypes.FEMALE, GenderTypes.OTHER])
  @ApiProperty({ example: 'male' })
  gender: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '01630630899' })
  phoneNo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'reja.info@gmail.com' })
  email: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  hasAccess: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2022-12-07' })
  registrationAt: string;
}

export class AuthAdminDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({ example: 'superadmin' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({ example: '123456' })
  password: string;
}

export class AdminSelectFieldDto {
  @IsOptional()
  @Matches(/^((?!password).)*$/)
  select: string;
}

export class FilterAdminDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  hasAccess: boolean;

  @IsOptional()
  @IsString()
  @IsIn([AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR])
  @ApiProperty({ required: false })
  role: string;

  @IsOptional()
  @IsString()
  @IsIn([GenderTypes.MALE, GenderTypes.FEMALE, GenderTypes.OTHER])
  @ApiProperty({ required: false })
  gender: string;
}

export class FilterAndPaginationAdminDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @ApiProperty()
  @Type(() => FilterAdminDto)
  filter: FilterAdminDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @ApiProperty()
  @Type(() => PaginationDto)
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

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  newPassword: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @IsIn([AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR])
  @ApiProperty()
  role: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ApiProperty()
  permissions: string[];

  @IsOptional()
  @IsString()
  @IsIn([GenderTypes.MALE, GenderTypes.FEMALE, GenderTypes.OTHER])
  @ApiProperty()
  gender: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNo: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  hasAccess: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ApiProperty()
  ids: string[];
}

/**
 * DTO FOR SWAGGER
 */
class AdminAuthSuccessPayloadData {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  permissions: string[];
}

class AdminRegistrationPayloadData {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;
}

export class AdminRegistrationPayloadDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: AdminRegistrationPayloadData;
}

export class AdminAuthPayloadDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: AdminAuthSuccessPayloadData;

  @ApiProperty()
  token: string;

  @ApiProperty()
  tokenExpiredIn: number;
}
