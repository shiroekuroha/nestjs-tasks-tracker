import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const member = await this.prisma.members.findFirst({
      where: { username: username, password: password, active: true },
    });

    if (member) {
      const payload = {
        sub: member.id,
        username: member.username,
      };

      return { access_token: await this.jwtService.signAsync(payload) };
    }

    throw new UnauthorizedException();
  }
}
