import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class GetRolePermissionsDto {
  @ApiProperty()
  @Expose()
  permissions!: string[];
}
