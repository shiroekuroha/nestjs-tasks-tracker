import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GetTaskGroupDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsString()
  color!: string;

  @Expose()
  @IsNumber()
  position!: number;

  @Expose()
  @IsNumber()
  projectId!: number;
}
