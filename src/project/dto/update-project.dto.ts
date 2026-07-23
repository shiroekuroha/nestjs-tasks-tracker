import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty()
  @Expose()
  @Length(1, 50)
  name?: string;
}
