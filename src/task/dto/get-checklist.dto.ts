import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class GetCheckListDto {
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
  task_id!: number;
}
