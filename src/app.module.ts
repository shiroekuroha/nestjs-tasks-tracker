import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { TrackerModule } from './tracker/tracker.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TrackerModule,
    AuthModule,
    UsersModule,
    RolesModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
