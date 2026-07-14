import { plainToInstance } from 'class-transformer';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { GetMemberDto } from '../member/dto/get-member.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectMemberDto } from './dto/get-project-member.dto';
import { GetProjectWholeDto } from './dto/get-project-whole.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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
    try {
      return plainToInstance(
        GetProjectDto,
        await this.prisma.project.update({ where: { id: id }, data }),
        { excludeExtraneousValues: true },
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException({
          prismaVersion: error.clientVersion,
          prismaCode: error.code,
          prismaError: error.message,
        });
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async createProject(
    data: CreateProjectDto,
    memberId: number,
  ): Promise<GetProjectDto> {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException({
          prismaVersion: error.clientVersion,
          prismaCode: error.code,
          prismaError: error.message,
        });
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteProject(id: number): Promise<GetProjectDto> {
    try {
      return plainToInstance(
        GetProjectDto,
        await this.prisma.project.delete({ where: { id: id } }),
        { excludeExtraneousValues: true },
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException({
          prismaVersion: error.clientVersion,
          prismaCode: error.code,
          prismaError: error.message,
        });
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
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
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException({
          prismaVersion: error.clientVersion,
          prismaCode: error.code,
          prismaError: error.message,
        });
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async removeProjectMember(
    pid: number,
    mid: number,
  ): Promise<GetProjectMemberDto> {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException({
          prismaVersion: error.clientVersion,
          prismaCode: error.code,
          prismaError: error.message,
        });
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async changeProjectMemberRole(
    pid: number,
    mid: number,
    rid: number,
  ): Promise<GetProjectMemberDto> {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException({
          prismaVersion: error.clientVersion,
          prismaCode: error.code,
          prismaError: error.message,
        });
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
}
