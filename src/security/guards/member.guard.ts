import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: { sub: number; username: string } = request['user'];
    const memberId: number = request.params['id'];

    try {
      switch (request.method) {
        case 'DELETE':
          if (payload.sub != memberId) return true;
          return false;
          break;

        default:
          return true;
          break;
      }
    } catch (error) {
      console.log(
        `------------------------ Guard Error ------------------------`,
      );
      console.log(error);

      console.log(
        `------------------------ Guard Error ------------------------`,
      );

      return false;
    }
  }
}
