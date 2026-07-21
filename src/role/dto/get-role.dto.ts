import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GetRoleDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;
}
