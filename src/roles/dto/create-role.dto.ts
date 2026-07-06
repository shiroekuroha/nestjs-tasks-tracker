import { isValidDate } from 'rxjs/internal/util/isDate';

import { ApiProperty } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';

export class CreateRoleDto {
  @ApiProperty()
  description!: string;

  
  @ApiProperty({ type: [CreatePermissionDto] })
  permissions!: CreatePermissionDto[];
}
