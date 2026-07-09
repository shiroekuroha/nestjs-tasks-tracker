import { plainToInstance } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRolePermissionsDto } from './dto/get-role-permissions.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(page: number, limit: number): Promise<GetRoleDto[]> {
    return plainToInstance(
      GetRoleDto,
      await this.prisma.roles.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getRoleCount(): Promise<number> {
    return await this.prisma.roles.count();
  }

  async getRole(id: number): Promise<GetRoleDto | null> {
    return plainToInstance(
      GetRoleDto,
      await this.prisma.roles.findUnique({ where: { id: id } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateRole(
    id: number,
    data: UpdateRoleDto,
  ): Promise<GetRoleDto | null> {
    try {
      return plainToInstance(
        GetRoleDto,
        await this.prisma.roles.update({
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

  async createRole(data: CreateRoleDto): Promise<GetRoleDto> {
    return plainToInstance(
      GetRoleDto,
      await this.prisma.roles.create({ data: { ...data } }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deleteRole(id: number): Promise<GetRoleDto | null> {
    try {
      return plainToInstance(
        GetRoleDto,
        await this.prisma.roles.delete({ where: { id: id } }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      return null;
    }
  }

  async rolePermissions(id: number): Promise<GetRolePermissionsDto | null> {
    return plainToInstance(
      GetRolePermissionsDto,
      {
        permissions: (
          await this.prisma.roles.findUnique({
            where: {
              id: id,
            },
            include: {
              role_permissions: {
                select: {
                  permissions: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          })
        )?.role_permissions.flatMap((rp) => rp.permissions.name),
      },
      { excludeExtraneousValues: true },
    );
  }
}
