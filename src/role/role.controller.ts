import { plainToInstance } from 'class-transformer';

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
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AnalyticsInterceptor } from '../analytics/analytics.interceptor';
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

  @UseInterceptors(AnalyticsInterceptor)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Roles found.' })
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
    const result = await this.roleService.getRoles(
      (page ?? def_page > 0) ? (page ?? def_page) : def_page,
      (limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit,
    );
    const count = await this.roleService.getRoleCount();

    return {
      data: plainToInstance(GetRoleDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: {
        page: page ?? def_page,
        item: result.length,
        total_pages: Math.ceil(count / (limit ?? def_limit)),
        total_items: count,
      },
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Role found.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  async getRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetRoleDto }> {
    const result = await this.roleService.getRole(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Role updated.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoleDto,
  ): Promise<{ data: GetRoleDto }> {
    return { data: await this.roleService.updateRole(id, data) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Role created.' })
  async createRole(@Body() data: CreateRoleDto): Promise<{ data: GetRoleDto }> {
    return { data: await this.roleService.createRole(data) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Role deleted.' })
  async deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetRoleDto }> {
    return { data: await this.roleService.deleteRole(id) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Get(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Role permissions found.' })
  async getRolePermissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetPermissionDto[] }> {
    return { data: await this.roleService.rolePermissions(id) };
  }
}
