import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetMemberDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  username!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @Expose()
  @IsDate()
  birthdate!: Date;

  @ApiProperty()
  @Expose()
  @IsString()
  email!: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsString()
  address?: string;
}
