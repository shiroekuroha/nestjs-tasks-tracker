import { plainToInstance } from 'class-transformer';

import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { GetTaskGroupDto } from '../task-group/dto/get-taskGroup.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetMemberRoleDto } from './dto/get-member-role.dto';
import { GetProjectMemberDto } from './dto/get-project-member.dto';
import { GetProjectWholeDto } from './dto/get-project-whole.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetTaskGroupReorderDto } from './dto/update-taskGroup-reorder.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects(page: number, limit: number): Promise<GetProjectDto[]> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.project.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getProjectCount(): Promise<number> {
    return await this.prisma.project.count();
  }

  async getProject(id: number): Promise<GetProjectDto | null> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.project.findUnique({ where: { id: id } }),
      { excludeExtraneousValues: true },
    );
  }

  async updateProject(
    id: number,
    data: UpdateProjectDto,
  ): Promise<GetProjectDto> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.project.update({ where: { id: id }, data }),
      { excludeExtraneousValues: true },
    );
  }

  async createProject(
    data: CreateProjectDto,
    ownerId: number,
  ): Promise<GetProjectDto> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.project.create({
        data: {
          ...data,
          member: {
            connect: {
              id: ownerId,
            },
          },
        },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async deleteProject(id: number): Promise<GetProjectDto> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.project.delete({ where: { id: id } }),
      { excludeExtraneousValues: true },
    );
  }

  async getProjectWhole(id: number): Promise<GetProjectWholeDto | null> {
    return plainToInstance(
      GetProjectWholeDto,
      await this.prisma.project.findUnique({
        where: { id: id },
        include: {
          projectMember: {
            include: {
              member: true,
            },
          },
          taskGroup: {
            include: {
              task: {
                include: {
                  taskMember: {
                    include: {
                      member: true,
                    },
                  },
                  attachment: true,
                  checklist: true,
                },
              },
            },
          },
        },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getProjectMembers(id: number): Promise<GetMemberRoleDto[]> {
    return plainToInstance(
      GetMemberRoleDto,
      (
        await this.prisma.project.findUnique({
          where: {
            id: id,
          },
          include: {
            projectMember: {
              include: {
                member: true,
                role: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        })
      )?.projectMember.map((member) => ({
        member: member.member,
        role: member.role,
      })) ?? [],
      { excludeExtraneousValues: true },
    );
  }

  async addProjectMember(
    id: number,
    memberId: number,
    roleId: number | null = null,
  ): Promise<GetProjectMemberDto> {
    return plainToInstance(
      GetProjectMemberDto,
      await this.prisma.projectMember.create({
        data: {
          projectId: id,
          memberId: memberId,
          roleId: roleId,
        },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async reorderTaskGroup(
    id: number,
    data: GetTaskGroupReorderDto,
  ): Promise<GetTaskGroupDto[]> {
    const taskGroup = await this.prisma.project.findUnique({
      where: { id: Number(id) },
      include: { taskGroup: { select: { id: true, position: true } } },
    });

    if (
      taskGroup?.taskGroup.find((value) => value.id == data.taskGroupId1) &&
      taskGroup?.taskGroup.find((value) => value.id == data.taskGroupId2)
    ) {
      const taskGroup1 = taskGroup.taskGroup.find(
        (t) => t.id === data.taskGroupId1,
      )!;
      const taskGroup2 = taskGroup.taskGroup.find(
        (t) => t.id === data.taskGroupId2,
      )!;

      return await this.prisma.$transaction(async (tx) => {
        await tx.taskGroup.update({
          where: { id: taskGroup1.id },
          data: { position: -1 },
        });

        return [
          await tx.taskGroup.update({
            where: { id: taskGroup2.id },
            data: { position: taskGroup1.position },
          }),

          await tx.taskGroup.update({
            where: { id: taskGroup1.id },
            data: { position: taskGroup2.position },
          }),
        ];
      });
    }
    throw new BadRequestException('Tasks not be in TaskGroup.');
  }

  async removeProjectMember(
    id: number,
    memberId: number,
  ): Promise<GetProjectMemberDto> {
    return plainToInstance(
      GetProjectMemberDto,
      await this.prisma.projectMember.delete({
        where: {
          projectId_memberId: {
            projectId: id,
            memberId: memberId,
          },
        },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async changeProjectMemberRole(
    id: number,
    memberId: number,
    roleId: number,
  ): Promise<GetProjectMemberDto> {
    return plainToInstance(
      GetProjectMemberDto,
      await this.prisma.projectMember.update({
        where: {
          projectId_memberId: {
            projectId: id,
            memberId: memberId,
          },
        },
        data: {
          roleId: roleId,
        },
      }),
      { excludeExtraneousValues: true },
    );
  }
}
