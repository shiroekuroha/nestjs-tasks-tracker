import { Expose } from 'class-transformer';
import { IsBoolean, IsString, ValidateIf } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateCheckListDto {
  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  name?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  description?: string;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
