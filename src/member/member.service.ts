import { plainToInstance } from 'class-transformer';

import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberDto } from './dto/get-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async getMembers(page: number, limit: number): Promise<GetMemberDto[]> {
    return plainToInstance(
      GetMemberDto,
      await this.prisma.members.findMany({
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
    return await this.prisma.members.count({ where: { active: true } });
  }

  async getMemberById(id: number): Promise<GetMemberDto | null> {
    const data = await this.prisma.members.findFirst({
      where: { id: id, active: true },
    });

    if (!data) return null;

    return plainToInstance(GetMemberDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async getMemberByUsername(username: string): Promise<GetMemberDto | null> {
    const data = await this.prisma.members.findFirst({
      where: { username: username, active: true },
    });

    if (!data) return null;

    return plainToInstance(GetMemberDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async updateMemberById(
    id: number,
    data: UpdateMemberDto,
  ): Promise<GetMemberDto | null> {
    const member = await this.getMemberById(id);

    if (member) {
      return plainToInstance(
        GetMemberDto,
        await this.prisma.members.update({
          where: { id: member.id },
          data: {
            ...data,
          },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    }

    return null;
  }

  async updateMemberByUsername(
    username: string,
    data: UpdateMemberDto,
  ): Promise<GetMemberDto | null> {
    const member = await this.getMemberByUsername(username);

    if (member) {
      return plainToInstance(
        GetMemberDto,
        await this.prisma.members.update({
          where: { id: member.id },
          data: {
            ...data,
          },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    }

    return null;
  }

  async createMember(data: CreateMemberDto): Promise<GetMemberDto> {
    if (await this.getMemberByUsername(data.username))
      throw new ForbiddenException('Forbidden', 'Member exists and is active.');

    return plainToInstance(
      GetMemberDto,
      await this.prisma.members.create({
        data: {
          ...data,
          active: true,
        },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deleteMemberById(id: number): Promise<GetMemberDto | null> {
    const member = await this.getMemberById(id);

    if (member)
      return plainToInstance(
        GetMemberDto,
        await this.prisma.members.update({
          where: { id: member.id },
          data: { active: false },
        }),
        {
          excludeExtraneousValues: true,
        },
      );

    return null;
  }

  async deleteMemberByUsername(username: string): Promise<GetMemberDto | null> {
    const member = await this.getMemberByUsername(username);

    if (member)
      return plainToInstance(
        GetMemberDto,
        await this.prisma.members.update({
          where: { id: member.id },
          data: { active: false },
        }),
        {
          excludeExtraneousValues: true,
        },
      );

    return null;
  }
}
