import { Expose } from 'class-transformer';
import { IsNumber, IsString, Length, Matches } from 'class-validator';

export class CreateTaskGroupDto {
  @Expose()
  @IsString()
  @Length(4, 50)
  name!: string;

  @Expose()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/)
  color!: string;
}
