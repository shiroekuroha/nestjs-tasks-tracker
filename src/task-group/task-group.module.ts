import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { TaskGroupController } from './task-group.controller';
import { TaskGroupService } from './task-group.service';

@Module({
  imports: [PrismaModule],
  providers: [TaskGroupService],
  controllers: [TaskGroupController],
})
export class TaskGroupModule {}
