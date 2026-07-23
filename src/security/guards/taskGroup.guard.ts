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
export class TaskGroupGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async getOwnerIdFromProjectId(projectId: number): Promise<number | null> {
    return (
      (
        await this.prisma.project.findUnique({
          where: { id: projectId },
          select: {
            ownerId: true,
          },
        })
      )?.ownerId ?? null
    );
  }

  async getOwnerId(taskGroupId: number): Promise<number | null> {
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

  async getPermissionsFromProjectId(
    projectId: number,
    memberId: number,
  ): Promise<GetPermissionDto[]> {
    return (
      (
        await this.prisma.projectMember.findUnique({
          where: {
            projectId_memberId: {
              projectId: projectId,
              memberId: memberId,
            },
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
        })
      )?.role?.rolePermission.map((value) => {
        const [scope, permission] = value.permission.name.split(':');
        return plainToInstance(GetPermissionDto, {
          scope: scope,
          permission: permission,
        });
      }) ?? []
    );
  }

  async getPermissions(
    taskGroupId: number,
    memberId: number,
  ): Promise<GetPermissionDto[]> {
    return (
      (
        await this.prisma.taskGroup.findUnique({
          where: {
            id: taskGroupId,
          },
          include: {
            project: {
              include: {
                projectMember: {
                  where: {
                    memberId: memberId,
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
    const authId: number = Number(request['user'].sub);
    const taskGroupId: number = Number(request.params['id']);

    // * GET
    if (request.method == 'GET') {
      return true;
    }

    // * PUT,  DELETE
    if (taskGroupId) {
      const taskGroup = await this.prisma.taskGroup.findUnique({
        where: {
          id: taskGroupId,
        },
      });

      if (taskGroup) {
        if ((await this.getOwnerId(taskGroupId)) === authId) {
          return true;
        }

        const permissions: GetPermissionDto[] = await this.getPermissions(
          taskGroupId,
          authId,
        );

        switch (request.method) {
          case 'PUT':
            if (
              permissions.find(
                (value) =>
                  value.scope == 'taskGroups' && value.action == 'update',
              )
            )
              return true;

            return false;

          case 'DELETE':
            if (
              permissions.find(
                (value) =>
                  value.scope == 'taskGroups' && value.action == 'delete',
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
    if (request.method === 'POST' && Number(request.params['projectId'])) {
      if (
        (await this.getOwnerIdFromProjectId(
          Number(request.params['projectId']),
        )) === authId
      ) {
        return true;
      }

      const permissions: GetPermissionDto[] =
        await this.getPermissionsFromProjectId(
          Number(request.params['projectId']),
          authId,
        );

      if (
        permissions.find(
          (value) => value.scope == 'taskGroups' && value.action == 'create',
        )
      )
        return true;

      return false;
    }

    return false;
  }
}
