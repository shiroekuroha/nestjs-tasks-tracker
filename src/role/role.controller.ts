import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../security/guards/auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetPermissionDto } from './dto/get-permission.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('roles')
@UseGuards(AuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getRoles(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    data: GetRoleDto[];
    meta: {
      page: number;
      item: number;
      total_pages: number;
      total_items: number;
    };
  }> {
    const def_page: number = 1;
    const def_limit: number = 10;

    page = (page ?? def_page > 0) ? (page ?? def_page) : def_page;
    limit = (limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit;

    const result = await this.roleService.getRoles(page, limit);
    const count = await this.roleService.getRoleCount();

    return {
      data: result,
      meta: {
        page: (page ?? def_page > 0) ? (page ?? def_page) : def_page,
        item: result.length,
        total_pages: Math.ceil(
          count / ((limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit),
        ),
        total_items: count,
      },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getRole(@Param('id', ParseUUIDPipe) id: string): Promise<GetRoleDto> {
    const result = await this.roleService.getRole(id);

    if (result) return result;

    throw new NotFoundException();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateRoleDto,
  ): Promise<GetRoleDto> {
    return await this.roleService.updateRole(id, data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() data: CreateRoleDto): Promise<GetRoleDto> {
    return await this.roleService.createRole(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetRoleDto> {
    return await this.roleService.deleteRole(id);
  }

  @Get(':id/permissions')
  @HttpCode(HttpStatus.OK)
  async getRolePermissions(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetPermissionDto[]> {
    return await this.roleService.rolePermissions(id);
  }
}
