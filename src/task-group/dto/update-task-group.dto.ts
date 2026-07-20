import { Expose } from 'class-transformer';
import { IsNumber, IsString, Length, ValidateIf } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskGroupDto {
  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @Length(4, 50)
  name?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @Length(7, 9)
  color?: string;
}
