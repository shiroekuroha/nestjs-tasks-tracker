import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsPhoneNumber, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiProperty()
  @Expose()
  @Length(8, 50)
  password?: string;

  @ApiProperty()
  @Expose()
  @Length(2, 25)
  first_name?: string;

  @ApiProperty()
  @Expose()
  @Length(2, 25)
  last_name?: string;

  @ApiProperty()
  @Expose()
  @IsDate()
  birthdate?: Date;

  @ApiProperty()
  @Expose()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @Expose()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @Expose()
  address?: string;
}
