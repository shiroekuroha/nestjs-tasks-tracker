import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { TaskGroupModule } from '../task-group/task-group.module';
import { TaskModule } from '../task/task.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [PrismaModule, SecurityModule],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
