import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectModule } from './project/project.module';
import { RoleModule } from './role/role.module';
import { SecurityModule } from './security/security.module';
import { TaskGroupModule } from './task-group/task-group.module';
import { TaskModule } from './task/task.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
