import { plainToInstance } from 'class-transformer';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
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
    try {
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

  async relinkTaskGroup(
    id: number,
    projectId: number,
  ): Promise<GetTaskGroupDto> {
    try {
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

  async createTaskGroup(
    data: CreateTaskGroupDto,
    projectId: number,
  ): Promise<GetTaskGroupDto> {
    try {
      return plainToInstance(
        GetTaskGroupDto,
        await this.prisma.taskGroup.create({
          data: { ...data, project: { connect: { id: projectId } } },
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

  async deleteTaskGroup(id: number): Promise<GetTaskGroupDto> {
    try {
      return plainToInstance(
        GetTaskGroupDto,
        await this.prisma.taskGroup.delete({ where: { id: id } }),
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
}
