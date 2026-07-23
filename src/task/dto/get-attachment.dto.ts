import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAttachmentDto {
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
  @Type(() => Buffer)
  data!: Buffer;

  @ApiProperty()
  @Expose()
  @IsNumber()
  taskId!: number;
}
