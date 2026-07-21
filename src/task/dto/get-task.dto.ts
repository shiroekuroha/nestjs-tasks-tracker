import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { StatusType } from '@prisma/client';

export class GetTaskDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsString()
  description!: string;

  @Expose()
  @IsNumber()
  position!: number;

  @Expose()
  @IsEnum(StatusType)
  status!: StatusType;

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

  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  @Expose()
  @IsNumber()
  taskGroupId!: number;
}
