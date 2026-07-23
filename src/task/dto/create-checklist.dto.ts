import { Expose } from 'class-transformer';
import { IsBoolean, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckListDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @Length(4, 50)
  name!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  description!: string;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  completed!: boolean;
}
