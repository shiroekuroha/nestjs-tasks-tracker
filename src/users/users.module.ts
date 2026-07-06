import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { userProviders } from './users.provider';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule],
  exports: [UsersService, ...userProviders],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
})
export class UsersModule {}
