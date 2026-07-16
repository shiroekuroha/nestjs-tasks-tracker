import { plainToInstance } from 'class-transformer';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { GetTaskGroupDto } from './dto/get-task-group.dto';
import { GetTaskReorderDto } from './dto/get-task-reorder.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';

@Injectable()
export class TaskGroupService {
  constructor(private prisma: PrismaService) {}

  async getTaskGroups(page: number, limit: number): Promise<GetTaskGroupDto[]> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.taskGroup.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getTaskGroupCount(): Promise<number> {
    return await this.prisma.taskGroup.count();
  }

  async getTaskGroup(id: number): Promise<GetTaskGroupDto | null> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.taskGroup.findUnique({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateTaskGroup(
    id: number,
    data: UpdateTaskGroupDto,
  ): Promise<GetTaskGroupDto> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.taskGroup.update({
        where: { id: id },
        data: { ...data },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async relinkTaskGroup(
    id: number,
    projectId: number,
  ): Promise<GetTaskGroupDto> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.taskGroup.update({
        where: { id: id },
        data: { project: { connect: { id: projectId } } },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async reorderTask(id: number, data: GetTaskReorderDto): Promise<any> {
    const taskGroup = await this.prisma.taskGroup.findUnique({
      where: { id: Number(id) },
      include: { task: { select: { id: true, position: true } } },
    });

    if (
      taskGroup?.task.find((value) => value.id == data.taskId1) &&
      taskGroup?.task.find((value) => value.id == data.taskId2)
    ) {
      const task1 = taskGroup.task.find((t) => t.id === data.taskId1)!;
      const task2 = taskGroup.task.find((t) => t.id === data.taskId2)!;

      await this.prisma.$transaction(async (tx) => {
        await tx.task.update({
          where: { id: task1.id },
          data: { position: -1 },
        });

        await tx.task.update({
          where: { id: task2.id },
          data: { position: task1.position },
        });

        await tx.task.update({
          where: { id: task1.id },
          data: { position: task2.position },
        });
      });

      return { message: 'Updated successfully!' };
    }
    throw new BadRequestException('Tasks might not be in TaskGroup.');
  }

  async createTaskGroup(
    data: CreateTaskGroupDto,
    projectId: number,
  ): Promise<GetTaskGroupDto> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.taskGroup.create({
        data: { ...data, project: { connect: { id: projectId } } },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deleteTaskGroup(id: number): Promise<GetTaskGroupDto> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.taskGroup.delete({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
