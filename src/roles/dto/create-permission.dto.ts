import { isValidDate } from 'rxjs/internal/util/isDate';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty()
  project!: string;

  @ApiProperty({
    type: 'object',
    properties: {
      view: { type: 'boolean' },
      update: { type: 'boolean' },
      create: { type: 'boolean' },
      delete: { type: 'boolean' },
    },
  })
  canRole!: {
    view: boolean;
    update: boolean;
    create: boolean;
    delete: boolean;
  };
}
