import { ApiProperty } from '@nestjs/swagger';
import { isValidDate } from 'rxjs/internal/util/isDate';

export class CreateUserLoginDto {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;
}
