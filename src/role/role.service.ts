import { plainToInstance } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetPermissionDto } from './dto/get-permission.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(page: number, limit: number): Promise<GetRoleDto[]> {
    return plainToInstance(
      GetRoleDto,
      await this.prisma.role.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
    );
  }

  async getRoleCount(): Promise<number> {
    return await this.prisma.role.count();
  }

  async getRole(id: number): Promise<GetRoleDto | null> {
    return plainToInstance(
      GetRoleDto,
      await this.prisma.role.findUnique({ where: { id: id } }),
    );
  }

  async updateRole(id: number, data: UpdateRoleDto): Promise<GetRoleDto> {
    return plainToInstance(
      GetRoleDto,
      await this.prisma.role.update({
        where: { id: id },
        data: { ...data },
      }),
    );
  }

  async createRole(data: CreateRoleDto): Promise<GetRoleDto> {
    return plainToInstance(
      GetRoleDto,
      await this.prisma.role.create({ data: { ...data } }),
    );
  }

  async deleteRole(id: number): Promise<GetRoleDto> {
    return plainToInstance(
      GetRoleDto,
      await this.prisma.role.delete({ where: { id: id } }),
    );
  }

  async rolePermissions(id: number): Promise<GetPermissionDto[]> {
    return plainToInstance(
      GetPermissionDto,
      (
        await this.prisma.role.findUnique({
          where: {
            id: id,
          },
          include: {
            rolePermission: {
              select: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        })
      )?.rolePermission.map((rp) => {
        const [scope, action] = rp.permission.name.split(':');
        return {
          scope: scope,
          action: action,
        };
      }) ?? [],
    );
  }
}
