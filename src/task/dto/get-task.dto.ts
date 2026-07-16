import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { StatusType } from '../../generated/prisma/enums';

export class GetTaskDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  description!: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  position!: number;

  @ApiProperty()
  @Expose()
  @IsEnum(StatusType)
  status!: StatusType;

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

  @ApiProperty()
  @Expose()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  @IsDate()
  updatedAt!: Date;

  @ApiProperty()
  @Expose()
  @IsNumber()
  taskGroupId!: number;
}
