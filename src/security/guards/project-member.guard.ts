import {
  CanActivate,
  ExecutionContext,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];
    const project_id: number = request.params['id'];

    try {
      const member_permissions = (
        await this.prisma.project_members.findFirst({
          where: {
            project_id: project_id,
            member_id: payload.sub,
          },
          include: {
            roles: {
              include: {
                role_permissions: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        })
      )?.roles?.role_permissions.map((pm) => pm.permissions.name);

      switch (request.method) {
        case 'PUT':
          if (
            member_permissions?.find((value: string) => {
              const [res, act] = value.split(':');
              if (res === 'projects' && act === 'change_role') return true;
            })
          )
            return false;
          break;
        case 'POST':
          if (
            member_permissions?.find((value: string) => {
              const [res, act] = value.split(':');
              if (res === 'projects' && act === 'add_member') return true;

              return false;
            })
          )
            return true;
          break;
        case 'DELETE':
          if (
            member_permissions?.find((value: string) => {
              const [res, act] = value.split(':');
              if (res === 'projects' && act === 'remove_member') return true;
            })
          )
            return false;
          break;
        default:
          return true;
      }
    } catch {
      return false;
    }

    return false;
  }
}
