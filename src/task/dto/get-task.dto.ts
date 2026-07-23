import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '@prisma/client';

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
  @ValidateIf((_, value) => value !== undefined)
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value)
  @ValidateIf((_, value) => value !== undefined)
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  @ApiProperty()
  @Expose()
  @IsNumber()
  taskGroupId!: number;
}
