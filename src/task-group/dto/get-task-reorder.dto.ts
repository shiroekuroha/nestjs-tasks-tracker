import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetTaskReorderDto {
  @Expose()
  @IsNumber()
  taskId1!: number;

  @Expose()
  @IsNumber()
  taskId2!: number;
}
