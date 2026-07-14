import { plainToInstance } from 'class-transformer';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetProjectDto } from '../project/dto/get-project.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberDto } from './dto/get-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async getMembers(page: number, limit: number): Promise<GetMemberDto[]> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.findMany({
        where: {
          active: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getMemberCount(): Promise<number> {
    return await this.prisma.member.count({ where: { active: true } });
  }

  async getMemberProjects(id: number): Promise<GetProjectDto[]> {
    return (
      (
        await this.prisma.member.findUnique({
          where: {
            id: id,
          },
          include: {
            projectMembers: {
              include: {
                project: true,
              },
            },
          },
        })
      )?.projectMembers.map((value) => value.project) ?? []
    );
  }

  async getMemberById(id: number): Promise<GetMemberDto | null> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.findFirst({
        where: { id: id, active: true },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getMemberByUsername(username: string): Promise<GetMemberDto | null> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.member.findFirst({
        where: { username: username, active: true },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateMemberById(
    id: number,
    data: UpdateMemberDto,
  ): Promise<GetMemberDto> {
    try {
      return plainToInstance(
        GetMemberDto,
        await this.prisma.member.update({
          where: { id: id, active: true },
          data: {
            ...data,
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

  async updateMemberByUsername(
    username: string,
    data: UpdateMemberDto,
  ): Promise<GetMemberDto> {
    try {
      return plainToInstance(
        GetMemberDto,
        (
          await this.prisma.member.updateManyAndReturn({
            where: { username: username, active: true },
            data: {
              ...data,
            },
          })
        ).at(0),
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

  async createMember(data: CreateMemberDto): Promise<GetMemberDto> {
    if (await this.getMemberByUsername(data.username))
      throw new ForbiddenException('Forbidden', 'Member exists and is active.');

    try {
      return plainToInstance(
        GetMemberDto,
        await this.prisma.member.create({
          data: {
            ...data,
            active: true,
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

  async deleteMemberById(id: number): Promise<GetMemberDto> {
    try {
      return plainToInstance(
        GetMemberDto,
        await this.prisma.member.update({
          where: { id: id, active: true },
          data: { active: false },
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

  async deleteMemberByUsername(username: string): Promise<GetMemberDto> {
    try {
      return plainToInstance(
        GetMemberDto,
        (
          await this.prisma.member.updateManyAndReturn({
            where: { username: username, active: true },
            data: { active: false },
          })
        ).at(0),
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
