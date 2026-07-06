import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { roleProviders } from './roles.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  exports: [RolesService, ...roleProviders],
  providers: [RolesService, ...roleProviders],
  controllers: [RolesController],
})
export class RolesModule {}