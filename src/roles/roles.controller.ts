import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
    @ApiOperation({ summary: 'Create new role using Body\'s JSON' })
  createUser(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Delete(':id')
    @ApiOperation({ summary: 'Delete existing role using Param\'s id' })
  deleteUser(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
