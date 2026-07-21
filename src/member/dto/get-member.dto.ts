import { Expose, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetMemberDto {
  @Expose()
  @IsNumber()
  id!: string;

  @Expose()
  @IsString()
  username!: string;

  @Expose()
  @IsString()
  firstName!: string;

  @Expose()
  @IsString()
  lastName!: string;

  @Expose()
  @Type(() => Date)
  @IsDate()
  birthdate!: Date;

  @Expose()
  @IsString()
  email!: string;

  @Expose()
  @IsOptional()
  @IsString()
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString()
  address?: string;
}
