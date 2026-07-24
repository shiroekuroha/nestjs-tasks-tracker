import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetChecklistDto {
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
  description!: string;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  completed!: boolean;

  @ApiProperty()
  @Expose()
  @IsNumber()
  taskId!: number;
}
