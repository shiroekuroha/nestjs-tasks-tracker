import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { StatusType } from '../../generated/prisma/enums';
import { GetMemberDto } from '../../member/dto/get-member.dto';
import { GetAttachmentDto } from '../../task/dto/get-attachment.dto';
import { GetChecklistDto } from '../../task/dto/get-checklist.dto';

export class GetProjectMemberMiddleDto {
  @ApiProperty()
  @Expose()
  projectId!: number;

  @ApiProperty()
  @Expose()
  memberId!: number;

  @ApiProperty()
  @Expose()
  roleId!: number;

  @ApiProperty()
  @Expose()
  member!: GetMemberDto;
}

export class GetProjectTaskGroupMiddleDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  color!: string;

  @ApiProperty()
  @Expose()
  position!: number;

  @ApiProperty()
  @Expose()
  projectId!: number;

  @ApiProperty()
  @Expose()
  task!: GetProjectTaskMiddleDto[];
}

export class GetProjectTaskMiddleDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty()
  @Expose()
  position!: number;

  @ApiProperty()
  @Expose()
  status!: StatusType;

  @ApiProperty()
  @Expose()
  startDate!: Date;

  @ApiProperty()
  @Expose()
  dueDate!: Date;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  @ApiProperty()
  @Expose()
  attachment?: GetAttachmentDto;

  @ApiProperty()
  @Expose()
  checklist?: GetChecklistDto;
}

export class GetProjectWholeDto {
  @ApiProperty()
  @Expose()
  projectId!: number;

  @ApiProperty()
  @Expose()
  name!: number;

  @ApiProperty()
  @Expose()
  projectMember!: GetProjectMemberMiddleDto[];

  @ApiProperty()
  @Expose()
  taskGroup!: GetProjectTaskGroupMiddleDto[];
}
