import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetRoleDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;
}
