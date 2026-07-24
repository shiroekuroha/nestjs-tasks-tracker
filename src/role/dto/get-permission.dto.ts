import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';
export class GetPermissionDto {
  @ApiProperty()
  @Expose()
  @IsString()
  scope!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  action!: string;
}
