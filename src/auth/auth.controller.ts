import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { GetMemberDto } from '../member/dto/get-member.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('member')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns member information.',
  })
  async getMember(@Req() req: Request): Promise<GetMemberDto> {
    const token = this.extractTokenFromHeader(req) ?? '';

    return await this.authService.verify(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns access token.',
  })
  async signIn(
    @Body() signInDto: UserLoginDto,
  ): Promise<{ access_token: string }> {
    return await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }

  private extractTokenFromHeader(request: Request): string | null {
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
