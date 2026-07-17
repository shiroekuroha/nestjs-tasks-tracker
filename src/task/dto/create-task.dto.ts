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

import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty()
  @Expose()
  @Length(4, 50)
  name!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  description!: string;

  @ApiProperty()
  @Expose()
  @IsInt()
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
}
