import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetProjectDto {
  @ApiProperty()
  @Expose()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  ownerId!: number;
}
