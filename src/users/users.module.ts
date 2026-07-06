import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { userProviders } from './users.provider';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { GuardModule } from 'src/guard/guard.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => GuardModule),
    JwtModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  exports: [UsersService, ...userProviders],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
})
export class UsersModule {}
