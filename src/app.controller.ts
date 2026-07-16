import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { AnalyticsInterceptor } from './analytics/analytics.interceptor';
import { AppService } from './app.service';
import { WrappersInterceptor } from './wrappers/wrappers.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
