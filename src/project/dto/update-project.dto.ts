import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

export class UpdateProjectDto {
  @Expose()
  @Length(1, 50)
  name?: string;
}
