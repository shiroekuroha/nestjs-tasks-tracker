import { plainToInstance } from 'class-transformer';

import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskGroupDto } from './dto/create-taskGroup.dto';
import { GetTaskReorderDto } from './dto/get-task-reorder.dto';
import { GetTaskGroupDto } from './dto/get-taskGroup.dto';
import { UpdateTaskGroupDto } from './dto/update-taskGroup.dto';

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

  async getTaskGroup(id: string): Promise<GetTaskGroupDto | null> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.taskGroup.findUnique({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateTaskGroup(
    id: string,
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
    id: string,
    projectId: string,
  ): Promise<{ result: string }> {
    const result = await this.prisma.$transaction(async (tx) => {
      const max = await tx.taskGroup.aggregate({
        where: { projectId: projectId },
        _max: { position: true },
      });

      await tx.taskGroup.update({
        where: { id: id },
        data: {
          project: {
            connect: {
              id: projectId,
            },
          },
          position: (max._max.position ?? 0) + 1,
        },
      });
    });

    return { result: 'Transaction is good!' };
  }

  async reorderTask(id: string, data: GetTaskReorderDto): Promise<any> {
    const taskGroup = await this.prisma.taskGroup.findUnique({
      where: { id: id },
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
    projectId: string,
  ): Promise<GetTaskGroupDto> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.$transaction(async (tx) => {
        const max = await tx.taskGroup.aggregate({
          where: { projectId: projectId },
          _max: { position: true },
        });

        return await tx.taskGroup.create({
          data: {
            ...data,
            position: (max._max.position ?? 0) + 1,
            project: {
              connect: {
                id: projectId,
              },
            },
          },
        });
      }),
      { excludeExtraneousValues: true },
    );
  }

  async deleteTaskGroup(id: string): Promise<GetTaskGroupDto> {
    return plainToInstance(
      GetTaskGroupDto,
      await this.prisma.taskGroup.delete({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
