import { Expose } from 'class-transformer';
import { IsDate, IsInt, Length, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { StatusType } from '../../generated/prisma/enums';

export class CreateTaskDto {
  @ApiProperty()
  @Expose()
  @Length(4, 50)
  name!: string;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty()
  @Expose()
  @IsInt()
  position!: number;

  @ApiProperty()
  @Expose()
  status!: StatusType;

  @ApiProperty()
  @Expose()
  @IsDate()
  startDate!: Date;

  @ApiProperty()
  @Expose()
  @IsDate()
  dueDate!: Date;
}
