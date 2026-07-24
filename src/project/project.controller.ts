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
import { ProjectMemberGuard } from '../security/guards/project-member.guard';
import { ProjectGuard } from '../security/guards/project.guard';
import { GetTaskGroupDto } from '../task-group/dto/get-taskGroup.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetMemberRoleDto } from './dto/get-member-role.dto';
import { GetProjectMemberDto } from './dto/get-project-member.dto';
import { GetProjectWholeDto } from './dto/get-project-whole.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetTaskGroupReorderDto } from './dto/update-taskGroup-reorder.dto';
import { ProjectService } from './project.service';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(ProjectGuard)
  @HttpCode(HttpStatus.OK)
  async getProjects(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    data: GetProjectDto[];
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

    const result = await this.projectService.getProjects(page, limit);
    const count = await this.projectService.getProjectCount();

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
  @UseGuards(ProjectGuard)
  @HttpCode(HttpStatus.OK)
  async getProject(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetProjectDto> {
    const result = await this.projectService.getProject(id);

    if (result) return result;

    throw new NotFoundException();
  }

  @Put(':id')
  @UseGuards(ProjectGuard)
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProjectDto,
  ): Promise<GetProjectDto> {
    return await this.projectService.updateProject(id, data);
  }

  @Post(':ownerId')
  @UseGuards(ProjectGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @Body() data: CreateProjectDto,
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
  ): Promise<GetProjectDto> {
    return await this.projectService.createProject(data, ownerId);
  }

  @Delete(':id')
  @UseGuards(ProjectGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetProjectDto> {
    return await this.projectService.deleteProject(id);
  }

  @Put(':id/reorder')
  @UseGuards(ProjectGuard)
  @HttpCode(HttpStatus.OK)
  async reorderProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: GetTaskGroupReorderDto,
  ): Promise<GetTaskGroupDto[]> {
    return await this.projectService.reorderTaskGroup(id, data);
  }

  @Get(':id/whole')
  @UseGuards(ProjectGuard)
  @HttpCode(HttpStatus.OK)
  async getProjectWhole(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetProjectWholeDto> {
    const result = await this.projectService.getProjectWhole(id);

    if (result) return result;

    throw new NotFoundException();
  }

  // ----------------------------------------------------------------------------- //
  // ----------------------------- Member Management ----------------------------- //
  // ----------------------------------------------------------------------------- //

  @Get(':id/members')
  @UseGuards(ProjectMemberGuard)
  @HttpCode(HttpStatus.OK)
  async getProjectMembers(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetMemberRoleDto[]> {
    return await this.projectService.getProjectMembers(id);
  }

  @Post(':id/members/:memberId')
  @UseGuards(ProjectMemberGuard)
  @HttpCode(HttpStatus.OK)
  async addProjectMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Query('roleId', new ParseUUIDPipe({ optional: true })) role_id: string,
  ): Promise<GetProjectMemberDto> {
    return await this.projectService.addProjectMember(
      id,
      memberId,
      role_id ?? null,
    );
  }

  @Delete(':id/members/:memberId')
  @UseGuards(ProjectMemberGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeProjectMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ): Promise<GetProjectMemberDto> {
    return await this.projectService.removeProjectMember(id, memberId);
  }

  @Put(':id/members/:memberId/role/:roleId')
  @UseGuards(ProjectMemberGuard)
  @HttpCode(HttpStatus.OK)
  async changeProjectMemberRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ): Promise<GetProjectMemberDto> {
    return await this.projectService.changeProjectMemberRole(
      id,
      memberId,
      roleId,
    );
  }
}
