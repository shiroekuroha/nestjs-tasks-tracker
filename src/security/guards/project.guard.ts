import { plainToInstance } from 'class-transformer';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { GetPermissionDto } from '../../role/dto/get-permission.dto';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async getPermissions(
    projectId: string,
    memberId: string,
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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authId: string = request['user'].sub;
    const projectId: string = request.params['id'];

    // * GET
    if (request.method == 'GET') {
      return true;
    }

    // * PUT, DELETE
    if (projectId) {
      const project = await this.prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (project) {
        if (project.ownerId == authId) {
          return true;
        }

        const permissions: GetPermissionDto[] = await this.getPermissions(
          projectId,
          authId,
        );

        switch (request.method) {
          case 'PUT':
            if (
              permissions.find(
                (value) =>
                  value.scope === 'projects' && value.action === 'update',
              )
            )
              return true;
            return false;

          case 'DELETE':
            if (
              permissions.find(
                (value) =>
                  value.scope === 'projects' && value.action === 'delete',
              )
            )
              return true;
            return false;

          default:
            return false;
            break;
        }
      }

      throw new NotFoundException();
    }
    // * GETs, POST
    {
      return true;
    }
  }
}
