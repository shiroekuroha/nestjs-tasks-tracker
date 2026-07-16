import { Expose, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(4, 50)
  name!: string;

  @ApiProperty()
  @Expose()
  @Type(() => Buffer)
  data!: Buffer;
}
