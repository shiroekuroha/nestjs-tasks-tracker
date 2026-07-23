import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
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

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(2, 25)
  firstName!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Length(2, 25)
  lastName!: string;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  @IsDate()
  birthdate!: Date;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value)
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value)
  @IsString()
  address?: string;
}
