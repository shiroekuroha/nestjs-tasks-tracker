import { plainToInstance } from 'class-transformer';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { GetMemberDto } from '../member/dto/get-member.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
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
    memberId: number,
  ): Promise<GetProjectDto> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.project.create({
        data: {
          ...data,
          projectMember: {
            create: {
              memberId: memberId,
              roleId: 1,
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
              member: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  birthdate: true,
                  email: true,
                  phone: true,
                  address: true,
                },
              },
            },
          },
          taskGroup: {
            include: {
              task: {
                include: {
                  taskMember: {
                    include: {
                      member: {
                        select: {
                          id: true,
                          username: true,
                          firstName: true,
                          lastName: true,
                          birthdate: true,
                          email: true,
                          phone: true,
                          address: true,
                        },
                      },
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

  async getProjectMembers(id: number): Promise<GetProjectMemberDto[]> {
    return plainToInstance(
      GetProjectMemberDto,
      (
        await this.prisma.project.findUnique({
          where: {
            id: id,
          },
          include: {
            projectMember: {
              include: {
                member: true,
              },
            },
          },
        })
      )?.projectMember.map((member) =>
        plainToInstance(GetMemberDto, member.member, {
          excludeExtraneousValues: true,
        }),
      ) ?? [],
      { excludeExtraneousValues: true },
    );
  }

  async addProjectMember(
    pid: number,
    mid: number,
    roleId: number | null = null,
  ): Promise<GetProjectMemberDto> {
    return plainToInstance(
      GetProjectMemberDto,
      await this.prisma.projectMember.create({
        data: {
          projectId: pid,
          memberId: mid,
          roleId: roleId,
        },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async reorderTaskGroup(
    id: number,
    data: GetTaskGroupReorderDto,
  ): Promise<any> {
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

      await this.prisma.$transaction(async (tx) => {
        await tx.taskGroup.update({
          where: { id: taskGroup1.id },
          data: { position: -1 },
        });

        await tx.taskGroup.update({
          where: { id: taskGroup2.id },
          data: { position: taskGroup1.position },
        });

        await tx.taskGroup.update({
          where: { id: taskGroup1.id },
          data: { position: taskGroup2.position },
        });
      });

      return { message: 'Updated successfully!' };
    }
    throw new BadRequestException('Tasks might not be in TaskGroup.');
  }

  async removeProjectMember(
    pid: number,
    mid: number,
  ): Promise<GetProjectMemberDto> {
    return plainToInstance(
      GetProjectMemberDto,
      await this.prisma.projectMember.delete({
        where: {
          projectId_memberId: {
            projectId: pid,
            memberId: mid,
          },
        },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async changeProjectMemberRole(
    pid: number,
    mid: number,
    rid: number,
  ): Promise<GetProjectMemberDto> {
    return plainToInstance(
      GetProjectMemberDto,
      await this.prisma.projectMember.update({
        where: {
          projectId_memberId: {
            projectId: pid,
            memberId: mid,
          },
        },
        data: {
          roleId: rid,
        },
      }),
      { excludeExtraneousValues: true },
    );
  }
}
