import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetTaskGroupReorderDto {
  @ApiProperty()
  @Expose()
  @IsUUID()
  taskGroupId1!: string;

  @ApiProperty()
  @Expose()
  @IsUUID()
  taskGroupId2!: string;
}
