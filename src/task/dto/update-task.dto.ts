import { Expose, Type } from 'class-transformer';
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
import { StatusType } from '@prisma/client';

export class UpdateTaskDto {
  @Expose()
  @Length(4, 50)
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  name?: string;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  description?: string;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(StatusType)
  status?: StatusType;

  @Expose()
  @ValidateIf((_, value) => value)
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @Expose()
  @ValidateIf((_, value) => value)
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;
}
