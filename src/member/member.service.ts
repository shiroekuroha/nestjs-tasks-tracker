import { plainToInstance } from 'class-transformer';

import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { GetProjectDto } from '../project/dto/get-project.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberDto } from './dto/get-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async getMembers(page: number, limit: number): Promise<GetMemberDto[]> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.findMany({
        where: {
          active: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getMemberCount(): Promise<number> {
    return await this.prisma.member.count({ where: { active: true } });
  }

  async getMemberProjectsById(id: string): Promise<GetProjectDto[]> {
    return plainToInstance(
      GetProjectDto,
      (
        await this.prisma.member.findUnique({
          where: {
            id: id,
            active: true,
          },
          include: {
            projectMembers: {
              include: {
                project: true,
              },
            },
          },
        })
      )?.projectMembers.map((value) => value.project) ?? [],
      { excludeExtraneousValues: true },
    );
  }

  async getMemberProjectsByUsername(
    username: string,
  ): Promise<GetProjectDto[]> {
    return plainToInstance(
      GetProjectDto,
      (
        await this.prisma.member.findFirst({
          where: {
            username: username,
            active: true,
          },
          include: {
            projectMembers: {
              include: {
                project: true,
              },
            },
          },
        })
      )?.projectMembers.map((value) => value.project) ?? [],
      { excludeExtraneousValues: true },
    );
  }

  async getMemberById(id: string): Promise<GetMemberDto | null> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.findFirst({
        where: { id: id, active: true },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getMemberByUsername(username: string): Promise<GetMemberDto | null> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.findFirst({
        where: { username: username, active: true },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateMemberById(
    id: string,
    data: UpdateMemberDto,
  ): Promise<GetMemberDto> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.update({
        where: { id: id, active: true },
        data: {
          ...data,
        },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateMemberByUsername(
    username: string,
    data: UpdateMemberDto,
  ): Promise<GetMemberDto> {
    return plainToInstance(
      GetMemberDto,
      (
        await this.prisma.member.updateManyAndReturn({
          where: { username: username, active: true },
          data: {
            ...data,
          },
        })
      ).at(0),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async createMember(data: CreateMemberDto): Promise<GetMemberDto> {
    if (await this.getMemberByUsername(data.username))
      throw new ForbiddenException('Forbidden', 'Member exists and is active.');

    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.create({
        data: {
          ...data,
          active: true,
        },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async restoreMember(id: string): Promise<GetMemberDto> {
    const targetUsername = (
      await this.prisma.member.findUnique({ where: { id: id } })
    )?.username;

    const activeRelated = await this.prisma.member.findMany({
      where: { username: targetUsername, active: true },
    });

    if (activeRelated.length != 0) {
      throw new ForbiddenException(
        'An account with that username is still active!',
      );
    }

    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.update({
        where: { id: id },
        data: { active: true },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async deleteMemberById(id: string): Promise<GetMemberDto> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.update({
        where: { id: id, active: true },
        data: { active: false },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deleteMemberByUsername(username: string): Promise<GetMemberDto> {
    return plainToInstance(
      GetMemberDto,
      (
        await this.prisma.member.updateManyAndReturn({
          where: { username: username, active: true },
          data: { active: false },
        })
      ).at(0),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
