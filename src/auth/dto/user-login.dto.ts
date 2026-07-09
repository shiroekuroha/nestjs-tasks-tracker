import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty()
  @Expose()
  username!: string;

  @ApiProperty()
  @Expose()
  password!: string;
}
