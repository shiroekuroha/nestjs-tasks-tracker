import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { GetMemberDto } from '../../member/dto/get-member.dto';

export class GetProjectMembersDto {
  @ApiProperty()
  @Expose()
  @Type(() => GetMemberDto)
  @ValidateNested({ each: true })
  project_members!: GetMemberDto[];
}
