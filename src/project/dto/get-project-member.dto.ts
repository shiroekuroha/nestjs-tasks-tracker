import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetProjectMemberDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  projectId!: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  memberId!: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  roleId!: number;
}
