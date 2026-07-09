import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
