import { ApiProperty } from '@nestjs/swagger';
import { isValidDate } from 'rxjs/internal/util/isDate';
import { TaskStatus } from '../enum/task.enum';

export class CreateNewTaskDto {
  @ApiProperty()
  description!: string;

  @ApiProperty()
  status!: TaskStatus;
}
