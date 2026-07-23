import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AnalyticsInterceptor } from './analytics/analytics.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './exceptions/global.exception-filter';
import { MailModule } from './mail/mail.module';
import { MemberModule } from './member/member.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectModule } from './project/project.module';
import { RoleModule } from './role/role.module';
import { SecurityModule } from './security/security.module';
import { TaskGroupModule } from './task-group/taskGroup.module';
import { TaskModule } from './task/task.module';
import { WrappersInterceptor } from './wrappers/wrappers.interceptor';

@Module({
  imports: [
    PrismaModule,
    MemberModule,
    AuthModule,
    SecurityModule,
    RoleModule,
    ProjectModule,
    TaskGroupModule,
    TaskModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    GlobalExceptionFilter,
    WrappersInterceptor,
    AnalyticsInterceptor,
  ],
})
export class AppModule {}
