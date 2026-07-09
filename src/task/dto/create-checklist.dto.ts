import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckListDto {
  @ApiProperty()
  @Expose()
  @Length(4, 50)
  name!: string;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty()
  @Expose()
  completed!: boolean;
}
