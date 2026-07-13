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
      await this.prisma.members.findMany({
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
    return await this.prisma.members.count({ where: { active: true } });
  }

  async getMemberProjects(id: number): Promise<GetProjectDto[]> {
    return (
      (
        await this.prisma.members.findUnique({
          where: {
            id: id,
          },
          include: {
            project_members: {
              include: {
                projects: true,
              },
            },
          },
        })
      )?.project_members.map((value) => value.projects) ?? []
    );
  }

  async getMemberById(id: number): Promise<GetMemberDto | null> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.members.findFirst({
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
      await this.prisma.members.findFirst({
        where: { username: username, active: true },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateMemberById(
    id: number,
    data: UpdateMemberDto,
  ): Promise<GetMemberDto | null> {
    try {
      return plainToInstance(
        GetMemberDto,
        await this.prisma.members.update({
          where: { id: id, active: true },
          data: {
            ...data,
          },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }

  async updateMemberByUsername(
    username: string,
    data: UpdateMemberDto,
  ): Promise<GetMemberDto | null> {
    try {
      return plainToInstance(
        GetMemberDto,
        (
          await this.prisma.members.updateManyAndReturn({
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
    } catch {
      return null;
    }
  }

  async createMember(data: CreateMemberDto): Promise<GetMemberDto> {
    if (await this.getMemberByUsername(data.username))
      throw new ForbiddenException('Forbidden', 'Member exists and is active.');

    return plainToInstance(
      GetMemberDto,
      await this.prisma.members.create({
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

  async deleteMemberById(id: number): Promise<GetMemberDto | null> {
    try {
      return plainToInstance(
        GetMemberDto,
        await this.prisma.members.update({
          where: { id: id, active: true },
          data: { active: false },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }

  async deleteMemberByUsername(username: string): Promise<GetMemberDto | null> {
    try {
      return plainToInstance(
        GetMemberDto,
        (
          await this.prisma.members.updateManyAndReturn({
            where: { username: username, active: true },
            data: { active: false },
          })
        ).at(0),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }
}
