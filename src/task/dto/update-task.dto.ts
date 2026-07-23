import { Expose, Type } from 'class-transformer';
import { IsDate, IsEnum, IsString, Length, ValidateIf } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '@prisma/client';

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
  @IsEnum(StatusType)
  status?: StatusType;

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
}
