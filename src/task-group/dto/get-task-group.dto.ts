import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetTaskGroupDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  color!: string;

  @ApiProperty()
  @Expose()
  position!: number;

  @ApiProperty()
  @Expose()
  projectId!: number;
}
