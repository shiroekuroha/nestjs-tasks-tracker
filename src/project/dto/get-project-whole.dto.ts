import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { StatusType } from '@prisma/client';

import { GetMemberDto } from '../../member/dto/get-member.dto';
import { GetAttachmentDto } from '../../task/dto/get-attachment.dto';
import { GetChecklistDto } from '../../task/dto/get-checklist.dto';

export class GetProjectMemberMiddleDto {
  @Expose()
  @IsNumber()
  projectId!: number;

  @Expose()
  @IsNumber()
  memberId!: number;

  @Expose()
  @IsNumber()
  roleId!: number;

  @Expose()
  @Type(() => GetMemberDto)
  member!: GetMemberDto;
}

export class GetProjectTaskGroupMiddleDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsString()
  color!: string;

  @Expose()
  @IsNumber()
  position!: number;

  @Expose()
  @IsNumber()
  projectId!: number;

  @Expose()
  @Type(() => GetProjectTaskMiddleDto)
  task!: GetProjectTaskMiddleDto[];
}

export class GetProjectTaskMiddleDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsString()
  description!: string;

  @Expose()
  @IsNumber()
  position!: number;

  @Expose()
  @IsEnum(StatusType)
  status!: StatusType;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  @Expose()
  @IsOptional()
  attachment?: GetAttachmentDto;

  @Expose()
  @IsOptional()
  checklist?: GetChecklistDto;
}

export class GetProjectWholeDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: number;

  @Expose()
  @Type(() => GetProjectMemberMiddleDto)
  projectMember!: GetProjectMemberMiddleDto[];

  @Expose()
  @Type(() => GetProjectTaskGroupMiddleDto)
  taskGroup!: GetProjectTaskGroupMiddleDto[];
}
