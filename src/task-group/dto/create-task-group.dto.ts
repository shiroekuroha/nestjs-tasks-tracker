import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskGroupDto {
  @ApiProperty()
  @Expose()
  @Length(4, 50)
  name!: string;

  @ApiProperty()
  @Expose()
  @Length(7, 9)
  color!: string;

  @ApiProperty()
  @Expose()
  position!: number;
}
