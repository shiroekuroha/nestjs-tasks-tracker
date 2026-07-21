import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class GetChecklistDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsString()
  description!: string;

  @Expose()
  @IsBoolean()
  completed!: boolean;

  @Expose()
  @IsNumber()
  taskId!: number;
}
