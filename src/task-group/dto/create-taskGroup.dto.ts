import { Expose } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskGroupDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(4, 50)
  name!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/)
  color!: string;
}
