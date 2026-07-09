import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class GetProjectMemberDto {
  @ApiProperty()
  @Expose()
  project_id!: number;

  @ApiProperty()
  @Expose()
  member_id!: number;

  @ApiProperty()
  @Expose()
  role_id?: number;
}
