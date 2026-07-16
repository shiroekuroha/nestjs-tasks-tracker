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
  @Matches(/[!@#$%^&*?:|_\-\+=~`]/, {
    message:
      'Password must contain at least one special character(!@#$%^&*?:|_\-\+=~`)',
  })
  @Matches(/\d/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one capital letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one non-capital letter',
  })
  password!: string;
}
