import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { RolesModule } from "src/roles/roles.module";
import { UsersModule } from "src/users/users.module";
import { AuthGuard } from "./guards/auth.guard";
import { RoleGuard } from "./guards/role.guard";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    RolesModule,
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
  providers: [AuthGuard, RoleGuard],
})
export class GuardModule {}
