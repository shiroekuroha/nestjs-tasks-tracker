import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { status_types } from '../../generated/prisma/enums';

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
  status!: status_types;

  @ApiProperty()
  @Expose()
  start_date!: Date;

  @ApiProperty()
  @Expose()
  due_date!: Date;

  @ApiProperty()
  @Expose()
  created_at!: Date;

  @ApiProperty()
  @Expose()
  updated_at!: Date;

  @ApiProperty()
  @Expose()
  task_group_id!: number;
}
