import { plainToInstance } from 'class-transformer';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GetMemberDto } from '../member/dto/get-member.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async verify(access_token: string): Promise<GetMemberDto> {
    try {
      if (!access_token) throw new UnauthorizedException();

      return plainToInstance(
        GetMemberDto,
        await this.prisma.member.findUnique({
          where: {
            id: (await this.jwtService.verifyAsync(access_token)).sub,
          },
        }),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch {
      throw new UnauthorizedException();
    }
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const member = await this.prisma.member.findFirst({
      where: { username: username, password: password, active: true },
    });

    if (member) {
      const payload = {
        sub: member.id,
        username: member.username,
      };

      return { access_token: await this.jwtService.signAsync(payload) };
    }

    throw new UnauthorizedException({
      message: 'Unauthorized',
      reason: 'Wrong username/password or account no longer active.',
      statusCode: 401,
    });
  }

  extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    if (type && token)
      return type.toLowerCase() === 'Bearer'.toLowerCase()
        ? token.length > 0
          ? token
          : null
        : null;

    return null;
  }
}
