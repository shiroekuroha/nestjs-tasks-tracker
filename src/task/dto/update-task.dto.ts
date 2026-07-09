import { Expose } from 'class-transformer';
import { IsDate, IsInt, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { status_types } from '../../generated/prisma/enums';

export class UpdateTaskDto {
  @ApiProperty()
  @Expose()
  @Length(4, 50)
  name?: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  @IsInt()
  position?: number;

  @ApiProperty()
  @Expose()
  status?: status_types;

  @ApiProperty()
  @Expose()
  @IsDate()
  start_date?: Date;

  @ApiProperty()
  @Expose()
  @IsDate()
  due_date?: Date;
}
