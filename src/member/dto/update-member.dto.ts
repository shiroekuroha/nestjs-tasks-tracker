import { Expose, Type } from 'class-transformer';
import {
    IsDate, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Matches, ValidateIf,
    ValidationArguments
} from 'class-validator';

export class UpdateMemberDto {
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string and cannot be null`,
  })
  @Length(8, 50)
  @Matches(/[!@#$%^&*?:|_\-\+=~`]/, {
    message:
      'password must contain at least one special character(!@#$%^&*?:|_\-\+=~`)',
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
  password?: string;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string and cannot be null`,
  })
  @Length(2, 25)
  firstName?: string;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string and cannot be null`,
  })
  @Length(2, 25)
  lastName?: string;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @Type(() => Date)
  @IsDate({
    message: (args: ValidationArguments) =>
      `${args.property} must be a date and cannot be null`,
  })
  birthdate?: Date;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsNotEmpty()
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string and cannot be null`,
  })
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string or null`,
  })
  @IsPhoneNumber()
  phone?: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsString({
    message: (args: ValidationArguments) =>
      `${args.property} must be a string or null`,
  })
  address?: string;
}
