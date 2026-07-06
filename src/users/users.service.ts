import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interface/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  find(username: string): Observable<User | null> {
    return from(this.userModel.findOne({ username: username }).exec());
  }

  update(
    username: string,
    createUserDto: CreateUserDto,
  ): Observable<User | null> {
    return from(
      this.userModel
        .findOneAndUpdate({ username: username }, createUserDto)
        .exec()
    );
  }

  create(createUserDto: CreateUserDto): Observable<User> {
    return from(this.userModel.create(createUserDto));
  }

  delete(id: string): Observable<User | null> {
    return from(this.userModel.findByIdAndDelete(id).exec());
  }
}
