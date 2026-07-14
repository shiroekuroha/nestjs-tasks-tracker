import { plainToInstance } from 'class-transformer';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { GetPermissionDto } from '../../role/dto/get-permission.dto';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];
    const projectId: number = Number(request.params['id']);

    try {
      console.log('Trying to authorize project access');
      if (request.method == 'POST') return true;

      const memberPermissions: GetPermissionDto[] = plainToInstance(
        GetPermissionDto,
        (
          await this.prisma.projectMember.findFirst({
            where: {
              projectId: projectId,
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
          })
        )?.role?.rolePermission.map((pm) => {
          const [scope, action] = pm.permission.name.split(':');
          return { scope: scope, action: action };
        }) ?? [],
        { excludeExtraneousValues: true },
      );

      switch (request.method) {
        case 'PUT':
          if (
            memberPermissions?.find(
              (permission: GetPermissionDto) =>
                permission.scope === 'projects' &&
                permission.action === 'update',
            )
          )
            return true;

          return false;

        case 'DELETE':
          if (
            memberPermissions?.find(
              (permission: GetPermissionDto) =>
                permission.scope === 'projects' &&
                permission.action === 'delete',
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
