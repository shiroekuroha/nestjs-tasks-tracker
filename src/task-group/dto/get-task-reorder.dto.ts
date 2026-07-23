import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetTaskReorderDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  taskId1!: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  taskId2!: number;
}
