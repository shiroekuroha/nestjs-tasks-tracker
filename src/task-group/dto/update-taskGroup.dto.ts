import { Expose } from 'class-transformer';
import { IsString, Length, Matches, ValidateIf } from 'class-validator';

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
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/)
  color?: string;
}
