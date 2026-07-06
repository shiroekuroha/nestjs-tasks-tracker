import { ApiProperty } from '@nestjs/swagger';
import { isValidDate } from 'rxjs/internal/util/isDate';
import { TaskStatus } from '../enum/task.enum';

export class CreateServerTaskDto {
  @ApiProperty()
  project!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  status!: TaskStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
