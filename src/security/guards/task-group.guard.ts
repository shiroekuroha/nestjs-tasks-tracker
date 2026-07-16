import { instanceToInstance, plainToInstance } from 'class-transformer';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { GetPermissionDto } from '../../role/dto/get-permission.dto';

@Injectable()
export class TaskGroupGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];

    if (request.method === 'POST') {
      try {
        const projectId: number = Number(request.params['projectId']);

        const result: GetPermissionDto[] = plainToInstance(
          GetPermissionDto,
          (
            await this.prisma.project.findUnique({
              where: { id: projectId },
              include: {
                projectMember: {
                  where: {
                    memberId: payload.sub,
                  },
                  include: {
                    role: {
                      include: {
                        rolePermission: {
                          include: {
                            permission: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            })
          )?.projectMember
            .at(0)
            ?.role?.rolePermission.map((permission) => {
              const [scope, action] = permission.permission.name.split(':');
              return { scope: scope, action: action };
            }) ?? [],
        );

        if (
          result?.find(
            (permission) =>
              permission.scope == 'taskGroups' &&
              permission.action === 'create',
          )
        )
          return true;

        return false;
      } catch (error) {
        return false;
      }
    }

    const taskGroupId: number = Number(request.params['id']);

    try {
      console.log('Trying to authorize task-group access');

      const result: GetPermissionDto[] = plainToInstance(
        GetPermissionDto,
        (
          await this.prisma.taskGroup.findUnique({
            where: { id: taskGroupId },
            include: {
              project: {
                include: {
                  projectMember: {
                    where: {
                      memberId: payload.sub,
                    },
                    include: {
                      role: {
                        include: {
                          rolePermission: {
                            include: {
                              permission: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          })
        )?.project.projectMember
          .at(0)
          ?.role?.rolePermission.map((permission) => {
            const [scope, action] = permission.permission.name.split(':');
            return { scope: scope, action: action };
          }) ?? [],
      );

      switch (request.method) {
        case 'PUT':
          if (
            result?.find(
              (permission) =>
                permission.scope == 'taskGroups' &&
                permission.action === 'update',
            )
          )
            return true;

          return false;

        case 'DELETE':
          if (
            result?.find(
              (permission) =>
                permission.scope == 'taskGroups' &&
                permission.action === 'delete',
            )
          )
            return true;

          return false;

        default:
          return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }
}
