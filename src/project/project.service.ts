import { plainToInstance } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { GetMemberDto } from '../member/dto/get-member.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectMemberDto } from './dto/get-project-member.dto';
import { GetProjectMembersDto } from './dto/get-project-members.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects(page: number, limit: number): Promise<GetProjectDto[]> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.projects.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getProjectCount(): Promise<number> {
    return await this.prisma.projects.count();
  }

  async getProject(id: number): Promise<GetProjectDto | null> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.projects.findUnique({ where: { id: id } }),
      { excludeExtraneousValues: true },
    );
  }

  async updateProject(
    id: number,
    data: UpdateProjectDto,
  ): Promise<GetProjectDto | null> {
    try {
      return plainToInstance(
        GetProjectDto,
        await this.prisma.projects.update({ where: { id: id }, data }),
        { excludeExtraneousValues: true },
      );
    } catch (err) {
      return null;
    }
  }

  async createProject(data: CreateProjectDto): Promise<GetProjectDto> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.projects.create({ data: { ...data } }),
      { excludeExtraneousValues: true },
    );
  }

  async deleteProject(id: number): Promise<GetProjectDto | null> {
    try {
      return plainToInstance(
        GetProjectDto,
        await this.prisma.projects.delete({ where: { id: id } }),
        { excludeExtraneousValues: true },
      );
    } catch (err) {
      return null;
    }
  }

  async getProjectMembers(id: number): Promise<GetProjectMembersDto | null> {
    return plainToInstance(
      GetProjectMembersDto,
      {
        project_members:
          (
            await this.prisma.projects.findUnique({
              where: {
                id: id,
              },
              include: {
                project_members: {
                  include: {
                    members: true,
                  },
                },
              },
            })
          )?.project_members.map((member) =>
            plainToInstance(GetMemberDto, member.members, {
              excludeExtraneousValues: true,
            }),
          ) ?? [],
      },
      { excludeExtraneousValues: true },
    );
  }

  async addProjectMember(
    pid: number,
    mid: number,
    role_id: number | null = null,
  ): Promise<GetProjectMemberDto | null> {
    try {
      return plainToInstance(
        GetProjectMemberDto,
        await this.prisma.project_members.create({
          data: {
            project_id: pid,
            member_id: mid,
            role_id: role_id,
          },
        }),
        { excludeExtraneousValues: true },
      );
    } catch {
      return null;
    }
  }

  async removeProjectMember(
    pid: number,
    mid: number,
  ): Promise<GetProjectMemberDto | null> {
    try {
      return plainToInstance(
        GetProjectMemberDto,
        await this.prisma.project_members.delete({
          where: {
            project_id_member_id: {
              project_id: pid,
              member_id: mid,
            },
          },
        }),
        { excludeExtraneousValues: true },
      );
    } catch {
      return null;
    }
  }

  async changeProjectMemberRole(
    pid: number,
    mid: number,
    rid: number,
  ): Promise<GetProjectMemberDto | null> {
    try {
      return plainToInstance(
        GetProjectMemberDto,
        await this.prisma.project_members.update({
          where: {
            project_id_member_id: {
              project_id: pid,
              member_id: mid,
            },
          },
          data: {
            role_id: rid,
          },
        }),
        { excludeExtraneousValues: true },
      );
    } catch {
      return null;
    }
  }
}
