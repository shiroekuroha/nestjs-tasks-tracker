import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { TrackerController } from './tracker.controller';
import { trackerProviders } from './tracker.provider';
import { TrackerService } from './tracker.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GuardModule } from 'src/guard/guard.module';

@Module({
  imports: [DatabaseModule, UsersModule, RolesModule, GuardModule, JwtModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '15m',
          },
        }),
      }),],
  controllers: [TrackerController],
  providers: [TrackerService, ...trackerProviders],
})
export class TrackerModule {}
