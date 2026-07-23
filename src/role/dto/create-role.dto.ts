import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(2, 50)
  name!: string;
}
