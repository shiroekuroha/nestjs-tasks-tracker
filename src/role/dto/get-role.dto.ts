import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetRoleDto {
  @ApiProperty()
  @Expose()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;
}
