import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateMemberDto {
  @Expose()
  @IsString()
  @Length(8, 50)
  username!: string;

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

  @Expose()
  @IsString()
  @Length(2, 25)
  firstName!: string;

  @Expose()
  @IsString()
  @Length(2, 25)
  lastName!: string;

  @Expose()
  @Type(() => Date)
  @IsDate()
  birthdate!: Date;

  @Expose()
  @IsString()
  @IsEmail()
  email!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString()
  address?: string;
}
