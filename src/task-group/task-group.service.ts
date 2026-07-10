import { plainToInstance } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { GetTaskGroupDto } from './dto/get-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';

@Injectable()
export class TaskGroupService {
  constructor(private prisma: PrismaService) {}

  async getTaskGroups(page: number, limit: number): Promise<GetTaskGroupDto[]> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.task_groups.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getTaskGroupCount(): Promise<number> {
    return await this.prisma.task_groups.count();
  }

  async getTaskGroup(id: number): Promise<GetTaskGroupDto | null> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.task_groups.findUnique({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateTaskGroup(
    id: number,
    data: UpdateTaskGroupDto,
  ): Promise<GetTaskGroupDto | null> {
    try {
      return plainToInstance(
        GetTaskGroupDto,
        await this.prisma.task_groups.update({
          where: { id: id },
          data: { ...data },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }

  async relinkTaskGroup(
    id: number,
    project_id: number,
  ): Promise<GetTaskGroupDto | null> {
    try {
      return plainToInstance(
        GetTaskGroupDto,
        await this.prisma.task_groups.update({
          where: { id: id },
          data: { projects: { connect: { id: project_id } } },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }

  async createTaskGroup(
    data: CreateTaskGroupDto,
    project_id: number,
  ): Promise<GetTaskGroupDto | null> {
    try {
      return plainToInstance(
        GetTaskGroupDto,
        await this.prisma.task_groups.create({
          data: { ...data, projects: { connect: { id: project_id } } },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }

  async deleteTaskGroup(id: number): Promise<GetTaskGroupDto | null> {
    try {
      return plainToInstance(
        GetTaskGroupDto,
        await this.prisma.task_groups.delete({ where: { id: id } }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }
}
