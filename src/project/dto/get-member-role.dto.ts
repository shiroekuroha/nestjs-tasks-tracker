import { Expose } from 'class-transformer';
import { IsObject } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { GetMemberDto } from '../../member/dto/get-member.dto';
import { GetRoleDto } from '../../role/dto/get-role.dto';

import { IsUUID } from 'class-validator';
export class GetMemberRoleDto {
  @ApiProperty()
  @Expose()
  @IsObject()
  member!: GetMemberDto;

  @ApiProperty()
  @Expose()
  @IsObject()
  role?: GetRoleDto;
}
