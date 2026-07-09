import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];
    const project_id: number = request.params['id'];

    try {
      await this.prisma.project_members.findUnique({
        where: {
          project_id_member_id: {
            project_id: project_id,
            member_id: payload.sub,
          },
        },
      });

      return true;
    } catch {
      return false;
    }
  }
}
