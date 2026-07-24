import { plainToInstance } from 'class-transformer';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { GetPermissionDto } from '../../role/dto/get-permission.dto';

@Injectable()
export class TaskGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async getOwnerIdFromTaskGroupId(taskGroupId: string): Promise<string | null> {
    return (
      (
        await this.prisma.taskGroup.findUnique({
          where: { id: taskGroupId },
          include: {
            project: {
              select: {
                ownerId: true,
              },
            },
          },
        })
      )?.project.ownerId ?? null
    );
  }

  async getOwnerId(taskId: string): Promise<string | null> {
    return (
      (
        await this.prisma.task.findUnique({
          where: { id: taskId },
          include: {
            taskGroup: {
              include: {
                project: {
                  select: {
                    ownerId: true,
                  },
                },
              },
            },
          },
        })
      )?.taskGroup.project.ownerId ?? null
    );
  }

  async getPermissionsFromTaskGroupId(
    taskGroupId: string,
    memberId: string,
  ): Promise<GetPermissionDto[]> {
    return (
      (
        await this.prisma.taskGroup.findUnique({
          where: { id: taskGroupId },
          include: {
            project: {
              include: {
                projectMember: {
                  where: { memberId: memberId },
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
        ?.role?.rolePermission.map((value) => {
          const [scope, permission] = value.permission.name.split(':');
          return plainToInstance(GetPermissionDto, {
            scope: scope,
            permission: permission,
          });
        }) ?? []
    );
  }

  async getPermissions(
    taskId: string,
    memberId: string,
  ): Promise<GetPermissionDto[]> {
    return (
      (
        await this.prisma.task.findUnique({
          where: { id: taskId },
          include: {
            taskGroup: {
              include: {
                project: {
                  include: {
                    projectMember: {
                      where: { memberId: memberId },
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
        ?.role?.rolePermission.map((value) => {
          const [scope, permission] = value.permission.name.split(':');
          return plainToInstance(GetPermissionDto, {
            scope: scope,
            permission: permission,
          });
        }) ?? []
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authId: string = request['user'].sub;
    const taskId: string = request.params['id'];

    // * GET
    if (request.method == 'GET') {
      return true;
    }

    // * PUT,  DELETE
    if (taskId) {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

      if (task) {
        if ((await this.getOwnerId(taskId)) === authId) {
          return true;
        }

        const permissions: GetPermissionDto[] = await this.getPermissions(
          taskId,
          authId,
        );

        switch (request.method) {
          case 'PUT':
            if (
              permissions.find(
                (value) => value.scope == 'tasks' && value.action == 'update',
              )
            )
              return true;

            return false;

          case 'DELETE':
            if (
              permissions.find(
                (value) => value.scope == 'tasks' && value.action == 'delete',
              )
            )
              return true;

            return false;

          default:
            return true;
        }
      }

      throw new NotFoundException();
    }

    // * POST
    if (request.method === 'POST' && request.params['taskGroupId']) {
      if (
        (await this.getOwnerIdFromTaskGroupId(
          request.params['taskGroupId'],
        )) === authId
      ) {
        return true;
      }

      const permissions: GetPermissionDto[] =
        await this.getPermissionsFromTaskGroupId(
          request.params['taskGroupId'],
          authId,
        );

      if (
        permissions.find(
          (value) => value.scope == 'tasks' && value.action == 'create',
        )
      )
        return true;

      return false;
    }

    return false;
  }
}
