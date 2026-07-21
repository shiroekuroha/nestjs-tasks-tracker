import { plainToInstance } from 'class-transformer';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { GetPermissionDto } from '../../role/dto/get-permission.dto';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];
    const projectId: number = request.params['id'];

    try {
      const memberPermissions: GetPermissionDto[] = plainToInstance(
        GetPermissionDto,
        (
          await this.prisma.projectMember.findFirst({
            where: {
              projectId: Number(projectId),
              memberId: Number(payload.sub),
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
      );

      switch (request.method) {
        case 'GET':
          return true;
          break;
        default:
          if (
            memberPermissions?.find(
              (permission: GetPermissionDto) =>
                permission.scope === 'projects' &&
                permission.action === 'member_management',
            )
          )
            return true;

          return false;
          break;
      }
    } catch (error) {
      console.log(error);

      return false;
    }

    return false;
  }
}
