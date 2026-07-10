import { plainToInstance } from 'class-transformer';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { GetProjectDto } from '../../project/dto/get-project.dto';

@Injectable()
export class TaskGroupGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];
    const res_type: string = 'task-groups';
    const task_group_id: number = request.params['id'];

    try {
      const result =
        (
          await this.prisma.task_groups.findUnique({
            where: { id: task_group_id },
            include: {
              projects: {
                include: {
                  project_members: {
                    where: {
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
                  },
                },
              },
            },
          })
        )?.projects.project_members
          .at(0)
          ?.roles?.role_permissions.map(
            (permission) => permission.permissions.name,
          ) ?? [];

      switch (request.method) {
        case 'PUT':
          result?.find((value) => {
            const [res, act] = value.split(':');
            if (res == res_type && act === 'update') return true;

            return false;
          });
          break;

        case 'POST':
          result?.find((value) => {
            const [res, act] = value.split(':');
            if (res == res_type && act === 'create') return true;

            return false;
          });
          break;

        case 'DELETE':
          result?.find((value) => {
            const [res, act] = value.split(':');
            if (res == res_type && act === 'delete') return true;

            return false;
          });
          break;

        default:
          return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }
}
