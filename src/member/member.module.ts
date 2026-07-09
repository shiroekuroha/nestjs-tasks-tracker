import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [PrismaModule, SecurityModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
