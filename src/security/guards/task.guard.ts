import { plainToInstance } from 'class-transformer';
import { error } from 'node:console';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { GetPermissionDto } from '../../role/dto/get-permission.dto';

@Injectable()
export class TaskGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];

    if (request.method == 'POST') {
      const taskGroupId: number = Number(request.params['taskGroupId']);
      try {
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
        if (
          result?.find(
            (permission) =>
              permission.scope == 'tasks' && permission.action === 'create',
          )
        )
          return true;

        return false;
      } catch (error) {
        console.log(error);

        return false;
      }
    }

    const taskId: number = Number(request.params['id']);

    if (!taskId) {
      return true;
    }

    try {
      const result: GetPermissionDto[] = plainToInstance(
        GetPermissionDto,
        (
          await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
              taskGroup: {
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
              },
            },
          })
        )?.taskGroup.project.projectMember
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
                permission.scope == 'tasks' && permission.action === 'update',
            )
          )
            return true;

          return false;

        case 'DELETE':
          if (
            result?.find(
              (permission) =>
                permission.scope == 'tasks' && permission.action === 'delete',
            )
          )
            return true;

          return false;

        default:
          return true;
      }
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}
