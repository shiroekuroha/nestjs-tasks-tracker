import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class GetPermissionDto {
  @ApiProperty()
  @Expose()
  scope!: string;

  @ApiProperty()
  @Expose()
  action!: string;
}
