import { Expose } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetTaskGroupDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  color!: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  position!: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  projectId!: number;
}
