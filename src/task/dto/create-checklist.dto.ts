import { Expose } from 'class-transformer';
import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateCheckListDto {
  @Expose()
  @IsString()
  @Length(4, 50)
  name!: string;

  @Expose()
  @IsString()
  description!: string;

  @Expose()
  @IsBoolean()
  completed!: boolean;
}
