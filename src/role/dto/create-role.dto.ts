import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  @Expose()
  name!: string;
}
