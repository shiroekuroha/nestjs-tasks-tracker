import { firstValueFrom, from, map, Observable, switchMap } from 'rxjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signIn(username: string, password: string) {
    return this.usersService.find(username).pipe(
      map(async (user) => {
        if (!user) {
          throw new UnauthorizedException();
        }

        const payload = {
          sub: user._id,
          username: user.username,
        };

        return { access_token: await this.jwtService.signAsync(payload)};
      }),
    );
  }
}
