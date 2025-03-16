import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ErrorPayloadDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string[];
}

export class PayloadObjectDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: any;
}

export class PayloadObjectArrayDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: any[];
}

export class PayloadMultipleIdDto {
  @ApiProperty()
  ids: any[];
}

export class ConflictPayloadDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;
}

export class OptionPayloadDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  deleteMany: boolean;
}
