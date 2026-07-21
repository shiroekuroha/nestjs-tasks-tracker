import { Expose } from 'class-transformer';
import { IsString, Length, Matches, ValidateIf } from 'class-validator';

export class UpdateTaskGroupDto {
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @Length(4, 50)
  name?: string;

  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/)
  color?: string;
}
