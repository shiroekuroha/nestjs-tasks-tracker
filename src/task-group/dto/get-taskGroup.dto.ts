import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetTaskGroupDto {
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
  @IsString()
  color!: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  position!: number;

  @ApiProperty()
  @Expose()
  @IsUUID()
  projectId!: string;
}
