import { plainToInstance } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { CreateCheckListDto } from './dto/create-checklist.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAttachmentDto } from './dto/get-attachment.dto';
import { GetCheckListDto } from './dto/get-checklist.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getTasks(page: number, limit: number): Promise<GetTaskDto[]> {
    return plainToInstance(
      GetTaskDto,
      await this.prisma.tasks.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getTaskCount(): Promise<number> {
    return await this.prisma.tasks.count();
  }

  async getTask(id: number): Promise<GetTaskDto | null> {
    return plainToInstance(
      GetTaskDto,
      await this.prisma.tasks.findUnique({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateTask(
    id: number,
    data: UpdateTaskDto,
  ): Promise<GetTaskDto | null> {
    try {
      return plainToInstance(
        GetTaskDto,
        await this.prisma.tasks.update({
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

  async relinkTask(
    id: number,
    task_group_id: number,
  ): Promise<GetTaskDto | null> {
    try {
      return plainToInstance(
        GetTaskDto,
        await this.prisma.tasks.update({
          where: { id: id },
          data: { task_groups: { connect: { id: task_group_id } } },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }

  async createTask(
    data: CreateTaskDto,
    task_group_id: number,
  ): Promise<GetTaskDto | null> {
    try {
      return plainToInstance(
        GetTaskDto,
        await this.prisma.tasks.create({
          data: {
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
            task_groups: { connect: { id: task_group_id } },
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

  async deleteTask(id: number): Promise<GetTaskDto | null> {
    try {
      return plainToInstance(
        GetTaskDto,
        await this.prisma.tasks.delete({ where: { id: id } }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }

  async addAttachment(
    tid: number,
    data: CreateAttachmentDto,
  ): Promise<GetAttachmentDto | null> {
    try {
      return plainToInstance(
        GetAttachmentDto,
        await this.prisma.attachments.create({
          data: {
            name: data.name,
            data: new Uint8Array(data.data),
            tasks: { connect: { id: tid } },
          },
        }),
        { excludeExtraneousValues: true },
      );
    } catch {
      return null;
    }
  }

  async removeAttachment(id: number): Promise<GetAttachmentDto | null> {
    try {
      return plainToInstance(
        GetAttachmentDto,
        await this.prisma.attachments.delete({
          where: { id: id },
        }),
        { excludeExtraneousValues: true },
      );
    } catch {
      return null;
    }
  }

  async addCheckList(
    tid: number,
    data: CreateCheckListDto,
  ): Promise<GetCheckListDto | null> {
    try {
      return plainToInstance(
        GetCheckListDto,
        await this.prisma.check_lists.create({
          data: {
            ...data,
            tasks: { connect: { id: tid } },
          },
        }),
        { excludeExtraneousValues: true },
      );
    } catch {
      return null;
    }
  }

  async removeCheckList(id: number): Promise<GetCheckListDto | null> {
    try {
      return plainToInstance(
        GetCheckListDto,
        await this.prisma.check_lists.delete({
          where: { id: id },
        }),
        { excludeExtraneousValues: true },
      );
    } catch {
      return null;
    }
  }
}
