import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GetAttachmentDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @Type(() => Buffer)
  data!: Buffer;

  @Expose()
  @IsNumber()
  taskId!: number;
}
