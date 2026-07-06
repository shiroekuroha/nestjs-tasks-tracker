import { Model } from 'mongoose';

import { Inject, Injectable } from '@nestjs/common';

import { Role } from './interface/role.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { Observable, from } from 'rxjs';

@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_MODEL')
    private roleModel: Model<Role>,
  ) {}

  find(id: string): Observable<Role | null> {
    return from(this.roleModel.findById(id).exec());
  }

  create(createRoleDto: CreateRoleDto): Observable<Role> {
    return from(this.roleModel.create(createRoleDto));
  }

  delete(id: string): Observable<Role | null> {
    return from(this.roleModel.findByIdAndDelete(id).exec());
  }
}
