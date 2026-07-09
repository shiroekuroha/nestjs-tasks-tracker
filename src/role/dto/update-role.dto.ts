import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty()
  @Expose()
  @Length(4, 50)
  name!: string;
}
