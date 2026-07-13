import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { GetMemberDto } from '../member/dto/get-member.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(AnalyticsInterceptor)
  @Get('member')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns member information.',
  })
  async getMember(
    @Body() signInDto: UserLoginDto,
    @Req() req: Request,
  ): Promise<{ data: GetMemberDto }> {
    const token = this.extractTokenFromHeader(req);

    return {
      data: await this.authService.verify(token),
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns access token.',
  })
  async signIn(
    @Body() signInDto: UserLoginDto,
  ): Promise<{ data: { access_token: string } }> {
    return {
      data: await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      ),
    };
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
