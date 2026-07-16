import { plainToInstance } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { CreateCheckListDto } from './dto/create-checklist.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAttachmentDto } from './dto/get-attachment.dto';
import { GetChecklistDto } from './dto/get-checklist.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getTasks(page: number, limit: number): Promise<GetTaskDto[]> {
    return plainToInstance(
      GetTaskDto,
      await this.prisma.task.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getTaskCount(): Promise<number> {
    return await this.prisma.task.count();
  }

  async getTask(id: number): Promise<GetTaskDto | null> {
    return plainToInstance(
      GetTaskDto,
      await this.prisma.task.findUnique({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateTask(id: number, data: UpdateTaskDto): Promise<GetTaskDto> {
    return plainToInstance(
      GetTaskDto,
      await this.prisma.task.update({
        where: { id: id },
        data: { ...data },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async relinkTask(id: number, taskGroupId: number): Promise<GetTaskDto> {
    return plainToInstance(
      GetTaskDto,
      await this.prisma.task.update({
        where: { id: id },
        data: { taskGroup: { connect: { id: taskGroupId } } },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async createTask(
    data: CreateTaskDto,
    taskGroupId: number,
  ): Promise<GetTaskDto> {
    return plainToInstance(
      GetTaskDto,
      await this.prisma.task.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
          taskGroup: { connect: { id: taskGroupId } },
        },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deleteTask(id: number): Promise<GetTaskDto> {
    return plainToInstance(
      GetTaskDto,
      await this.prisma.task.delete({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async addAttachment(
    tid: number,
    data: CreateAttachmentDto,
  ): Promise<GetAttachmentDto> {
    return plainToInstance(
      GetAttachmentDto,
      await this.prisma.attachment.create({
        data: {
          name: data.name,
          data: new Uint8Array(data.data),
          task: { connect: { id: tid } },
        },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async removeAttachment(id: number): Promise<GetAttachmentDto> {
    return plainToInstance(
      GetAttachmentDto,
      await this.prisma.attachment.delete({
        where: { id: id },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async addCheckList(
    tid: number,
    data: CreateCheckListDto,
  ): Promise<GetChecklistDto> {
    return plainToInstance(
      GetChecklistDto,
      await this.prisma.checklist.create({
        data: {
          ...data,
          task: { connect: { id: tid } },
        },
      }),
      { excludeExtraneousValues: true },
    );
  }

  async removeCheckList(id: number): Promise<GetChecklistDto> {
    return plainToInstance(
      GetChecklistDto,
      await this.prisma.checklist.delete({
        where: { id: id },
      }),
      { excludeExtraneousValues: true },
    );
  }
}
