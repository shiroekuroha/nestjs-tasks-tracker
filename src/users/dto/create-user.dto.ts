import { ApiProperty } from '@nestjs/swagger';
import { isValidDate } from 'rxjs/internal/util/isDate';

export class CreateUserDto {
  @ApiProperty()
  username!: String;

  @ApiProperty()
  password!: String;

  @ApiProperty()
  roleId!: String;

  @ApiProperty()
  meta?: [any];
}
