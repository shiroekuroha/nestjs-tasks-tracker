import { plainToInstance } from 'class-transformer';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
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
    try {
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

  async relinkTask(id: number, taskGroupId: number): Promise<GetTaskDto> {
    try {
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

  async createTask(
    data: CreateTaskDto,
    taskGroupId: number,
  ): Promise<GetTaskDto> {
    try {
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

  async deleteTask(id: number): Promise<GetTaskDto> {
    try {
      return plainToInstance(
        GetTaskDto,
        await this.prisma.task.delete({ where: { id: id } }),
        {
          excludeExtraneousValues: true,
        },
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

  async addAttachment(
    tid: number,
    data: CreateAttachmentDto,
  ): Promise<GetAttachmentDto> {
    try {
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

  async removeAttachment(id: number): Promise<GetAttachmentDto> {
    try {
      return plainToInstance(
        GetAttachmentDto,
        await this.prisma.attachment.delete({
          where: { id: id },
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

  async addCheckList(
    tid: number,
    data: CreateCheckListDto,
  ): Promise<GetChecklistDto> {
    try {
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

  async removeCheckList(id: number): Promise<GetChecklistDto> {
    try {
      return plainToInstance(
        GetChecklistDto,
        await this.prisma.checklist.delete({
          where: { id: id },
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
