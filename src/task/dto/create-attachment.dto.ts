import { Expose, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateAttachmentDto {
  @Expose()
  @IsString()
  @Length(4, 50)
  name!: string;

  @Expose()
  @Type(() => Buffer)
  data!: Buffer;
}
