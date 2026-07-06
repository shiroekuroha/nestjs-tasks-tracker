import { map, switchMap } from 'rxjs';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const targetProject = request.params.project;
    const currentUser = request.user;

    return this.usersService.find(currentUser.username).pipe(
      switchMap((user) => {
        if (!user) {
          throw new UnauthorizedException();
        }

        return this.rolesService.find(user.roleId.toString());
      }),
      map((role) => {
        const permission = role?.permissions.find(
          (p) => p.project === targetProject,
        );

        switch (request.method) {
          case 'GET':
            if (!permission?.canRole.view) {
              throw new UnauthorizedException();
            }
            break;

          case 'POST':
            if (!permission?.canRole.create) {
              throw new UnauthorizedException();
            }
            break;

          case 'PUT':
            if (!permission?.canRole.update) {
              throw new UnauthorizedException();
            }
            break;

          case 'DELETE':
            if (!permission?.canRole.delete) {
              throw new UnauthorizedException();
            }
            break;

          default:
            throw new UnauthorizedException();
        }

        return true;
      }),
    );
  }
}
