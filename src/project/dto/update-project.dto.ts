import { Expose } from 'class-transformer';
import { Length, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty()
  @Expose()
  @Length(4, 50)
  name?: string;
}
