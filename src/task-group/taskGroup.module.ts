import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { TaskGroupController } from './taskGroup.controller';
import { TaskGroupService } from './taskGroup.service';

@Module({
  imports: [PrismaModule, SecurityModule],
  providers: [TaskGroupService],
  controllers: [TaskGroupController],
})
export class TaskGroupModule {}
