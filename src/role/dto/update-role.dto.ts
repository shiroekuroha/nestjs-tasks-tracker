import { Expose } from 'class-transformer';
import { Length, ValidateIf } from 'class-validator';

export class UpdateRoleDto {
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @Length(4, 50)
  name!: string;
}
