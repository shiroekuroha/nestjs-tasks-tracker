import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string and cannot be null`,
  })
  @Length(8, 50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?:|_\-+=~`]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string and cannot be null`,
  })
  @Length(2, 25)
  firstName?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string and cannot be null`,
  })
  @Length(2, 25)
  lastName?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @Type(() => Date)
  @IsDate({
    message: (args: ValidationArguments) =>
      `${args.property} must be a date and cannot be null`,
  })
  birthdate?: Date;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string and cannot be null`,
  })
  @IsEmail()
  email?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value)
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  address?: string;
}
