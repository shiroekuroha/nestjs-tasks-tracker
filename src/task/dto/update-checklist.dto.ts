import { Expose } from 'class-transformer';
import { IsBoolean, IsString, ValidateIf } from 'class-validator';

export class UpdateCheckListDto {
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  name?: string;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  description?: string;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
