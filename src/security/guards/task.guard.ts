import { plainToInstance } from 'class-transformer';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { GetProjectDto } from '../../project/dto/get-project.dto';

@Injectable()
export class TaskGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];
    const task_id: number = request.params['id'];

    try {
      await this.prisma.tasks.findUnique({
        where: {
          id: task_id,
        },
      });
    } catch {}

    const project = await this.getProject(task_id);

    if (!project) return false;

    const permissions = await this.getProjectMemberPermission(
      project.id,
      payload.sub,
    );

    switch (request.method) {
      case 'PUT':
        permissions?.find((value) => {
          const [res, act] = value.split(':');
          if (res == 'tasks' && act === 'update') return true;

          return false;
        });
        break;

      case 'POST':
        permissions?.find((value) => {
          const [res, act] = value.split(':');
          if (res == 'tasks' && act === 'create') return true;

          return false;
        });
        break;

      case 'DELETE':
        permissions?.find((value) => {
          const [res, act] = value.split(':');
          if (res == 'tasks' && act === 'delete') return true;

          return false;
        });
        break;

      default:
        return true;
        break;
    }

    return true;
  }

  async getProject(task_id: number): Promise<GetProjectDto | null> {
    return plainToInstance(
      GetProjectDto,
      await this.prisma.projects.findUnique({
        where: {
          id: (
            await this.prisma.task_groups.findUnique({
              where: {
                id: Number(task_id),
              },
            })
          )?.project_id,
        },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getProjectMemberPermission(
    project_id: number,
    member_id: number,
  ): Promise<string[] | null> {
    const role_id = (
      await this.prisma.project_members.findUnique({
        where: {
          project_id_member_id: {
            project_id: project_id,
            member_id: member_id,
          },
        },
      })
    )?.role_id;

    if (role_id)
      return (
        (
          await this.prisma.roles.findUnique({
            where: {
              id: role_id,
            },
            include: {
              role_permissions: {
                include: {
                  permissions: true,
                },
              },
            },
          })
        )?.role_permissions.map((rp) => rp.permissions.name) ?? []
      );

    return null;
  }
}
