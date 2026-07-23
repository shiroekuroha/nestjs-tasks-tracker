import { Expose } from 'class-transformer';
import { Length, ValidateIf } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @Length(4, 50)
  name!: string;
}
