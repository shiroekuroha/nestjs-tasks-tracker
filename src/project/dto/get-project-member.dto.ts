import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class GetProjectMemberDto {
  @ApiProperty()
  @Expose()
  projectId!: number;

  @ApiProperty()
  @Expose()
  memberId!: number;

  @ApiProperty()
  @Expose()
  roleId?: number;
}
