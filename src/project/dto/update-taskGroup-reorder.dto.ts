import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetTaskGroupReorderDto {
  @Expose()
  @IsNumber()
  taskGroupId1!: number;

  @Expose()
  @IsNumber()
  taskGroupId2!: number;
}
