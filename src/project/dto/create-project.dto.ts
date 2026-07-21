import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @Expose()
  @IsString()
  @Length(4, 50)
  name!: string;
}
