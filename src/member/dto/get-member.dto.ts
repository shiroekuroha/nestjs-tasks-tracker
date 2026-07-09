import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class GetMemberDto {
  @ApiProperty()
  @Expose()
  id!: number;
    
  @ApiProperty()
  @Expose()
  username!: string;

  @ApiProperty()
  @Expose()
  first_name!: string;

  @ApiProperty()
  @Expose()
  last_name!: string;

  @ApiProperty()
  @Expose()
  birthdate!: Date;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty()
  @Expose()
  phone?: string;

  @ApiProperty()
  @Expose()
  address?: string;
}
