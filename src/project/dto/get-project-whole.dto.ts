import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '@prisma/client';

import { GetMemberDto } from '../../member/dto/get-member.dto';
import { GetAttachmentDto } from '../../task/dto/get-attachment.dto';
import { GetChecklistDto } from '../../task/dto/get-checklist.dto';

export class GetProjectMemberMiddleDto {
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

  @ApiProperty()
  @Expose()
  @Type(() => GetMemberDto)
  member!: GetMemberDto;
}

export class GetProjectTaskGroupMiddleDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  color!: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  position!: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  projectId!: number;

  @ApiProperty()
  @Expose()
  @Type(() => GetProjectTaskMiddleDto)
  task!: GetProjectTaskMiddleDto[];
}

export class GetProjectTaskMiddleDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  description!: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  position!: number;

  @ApiProperty()
  @Expose()
  @IsEnum(StatusType)
  status!: StatusType;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  attachment?: GetAttachmentDto;

  @ApiProperty()
  @Expose()
  @ValidateIf((_, value) => value !== undefined)
  checklist?: GetChecklistDto;
}

export class GetProjectWholeDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @Expose()
  @IsString()
  name!: number;

  @ApiProperty()
  @Expose()
  @Type(() => GetProjectMemberMiddleDto)
  projectMember!: GetProjectMemberMiddleDto[];

  @ApiProperty()
  @Expose()
  @Type(() => GetProjectTaskGroupMiddleDto)
  taskGroup!: GetProjectTaskGroupMiddleDto[];
}
