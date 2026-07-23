import { Expose } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(8, 50)
  username!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(8, 50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?:|_\-+=~`]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password!: string;
}
