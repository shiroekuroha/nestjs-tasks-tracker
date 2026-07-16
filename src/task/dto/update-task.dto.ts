import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { StatusType } from '../../generated/prisma/enums';

export class UpdateTaskDto {
  @ApiProperty()
  @Expose()
  @Length(4, 50)
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  name?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  description?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  position?: number;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(StatusType)
  status?: StatusType;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value)
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value)
  @IsOptional()
  @IsDate()
  dueDate?: Date;
}
