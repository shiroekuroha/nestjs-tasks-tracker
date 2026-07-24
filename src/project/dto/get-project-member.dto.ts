import { Expose } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetProjectMemberDto {
  @ApiProperty()
  @Expose()
  @IsUUID()
  projectId!: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  memberId!: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  roleId!: number;
}
