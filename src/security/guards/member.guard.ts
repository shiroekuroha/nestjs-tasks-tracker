import { plainToInstance } from 'class-transformer';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { GetPermissionDto } from '../../role/dto/get-permission.dto';

@Injectable()
export class MemberGuard implements CanActivate {
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
    const memberId: string = request.params['id'];

    // * GET
    if (request.method == 'GET') {
      return true;
    }

    // * PUT, DELETE
    if (memberId) {
      if (memberId == authId && request.method == 'DELETE') {
        throw new ForbiddenException('Cannot self-delete');
      }

      return true;
    }

    return true;
  }
}
