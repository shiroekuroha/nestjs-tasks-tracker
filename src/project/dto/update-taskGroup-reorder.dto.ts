import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetTaskGroupReorderDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  taskGroupId1!: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  taskGroupId2!: number;
}
