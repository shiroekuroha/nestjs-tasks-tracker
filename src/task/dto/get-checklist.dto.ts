import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class GetChecklistDto {
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
  completed!: boolean;

  @ApiProperty()
  @Expose()
  taskId!: number;
}
