import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GetPermissionDto {
  @Expose()
  @IsString()
  scope!: string;

  @Expose()
  @IsString()
  action!: string;
}
