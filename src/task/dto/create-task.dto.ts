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

import { StatusType } from '@prisma/client';

export class CreateTaskDto {
  @Expose()
  @Length(4, 50)
  name!: string;

  @Expose()
  @IsString()
  description!: string;

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
}
