import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;
}
