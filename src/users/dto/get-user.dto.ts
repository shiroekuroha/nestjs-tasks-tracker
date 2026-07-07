import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { isValidDate } from 'rxjs/internal/util/isDate';

export class GetUserDto {
    @ApiProperty()
    _id!: Types.ObjectId;

  @ApiProperty()
  username!: String;

  @ApiProperty()
  roleId!: String;

  @ApiProperty()
  meta?: [any];
}
