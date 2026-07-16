import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(4, 50)
  name!: string;
}
