import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetTaskReorderDto {
  @ApiProperty()
  @Expose()
  @IsUUID()
  taskId1!: string;

  @ApiProperty()
  @Expose()
  @IsUUID()
  taskId2!: string;
}
