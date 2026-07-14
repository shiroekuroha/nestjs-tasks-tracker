import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { StatusType } from '../../generated/prisma/enums';

export class GetTaskDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty()
  @Expose()
  position!: number;

  @ApiProperty()
  @Expose()
  status!: StatusType;

  @ApiProperty()
  @Expose()
  startDate!: Date;

  @ApiProperty()
  @Expose()
  dueDate!: Date;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  @ApiProperty()
  @Expose()
  taskGroupId!: number;
}
