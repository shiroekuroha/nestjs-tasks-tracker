import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class GetAttachmentDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  data!: Buffer;

  @ApiProperty()
  @Expose()
  task_id!: number;
}
