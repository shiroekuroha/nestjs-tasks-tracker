import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateCheckListDto {
  @ApiProperty()
  @Expose()
  name?: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  completed?: boolean;
}
