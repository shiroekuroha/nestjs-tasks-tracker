import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @Expose()
  @IsString()
  @Length(2, 50)
  name!: string;
}
