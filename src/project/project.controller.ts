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
import { ProjectMemberGuard } from '../security/guards/project-member.guard';
import { ProjectGuard } from '../security/guards/project.guard';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectMemberDto } from './dto/get-project-member.dto';
import { GetProjectMembersDto } from './dto/get-project-members.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseInterceptors(AnalyticsInterceptor)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Projects found.',
  })
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
    const result = await this.projectService.getProjects(
      page ?? def_page,
      limit ?? def_limit,
    );
    const count = await this.projectService.getProjectCount();

    return {
      data: plainToInstance(GetProjectDto, result, {
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
  @ApiOkResponse({
    description: 'Project found.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  async getProject(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetProjectDto }> {
    const result = await this.projectService.getProject(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project updated.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProjectDto,
  ): Promise<{ data: GetProjectDto }> {
    const result = await this.projectService.updateProject(id, data);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project created.',
  })
  async createProject(
    @Body() data: CreateProjectDto,
  ): Promise<{ data: GetProjectDto }> {
    return {
      data: plainToInstance(
        GetProjectDto,
        await this.projectService.createProject(data),
        {
          excludeExtraneousValues: true,
        },
      ),
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Project deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  async deleteProject(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetProjectDto }> {
    const result = await this.projectService.deleteProject(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Get(':id/whole')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  async getProjectWhole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: any }> {
    const result = await this.projectService.getProjectWhole(id);

    console.log(result);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  // ----------------------------------------------------------------------------- //
  // ----------------------------- Member Management ----------------------------- //
  // ----------------------------------------------------------------------------- //

  @UseInterceptors(AnalyticsInterceptor)
  @Get(':id/members')
  @UseGuards(ProjectMemberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project members found.',
  })
  @ApiNotFoundResponse({
    description: 'Project members not found.',
  })
  async getProjectMembers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetProjectMembersDto }> {
    const result = await this.projectService.getProjectMembers(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post(':id/members/:mid')
  @UseGuards(ProjectMemberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project member added.',
  })
  @ApiNotFoundResponse({
    description: 'Project/Member or role not found.',
  })
  async addProjectMember(
    @Param('id', ParseIntPipe) pid: number,
    @Param('mid', ParseIntPipe) mid: number,
    @Query('rid', new ParseIntPipe({ optional: true })) role_id: number,
  ): Promise<{ data: GetProjectMemberDto }> {
    const result = await this.projectService.addProjectMember(
      pid,
      mid,
      role_id ?? null,
    );

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete(':id/members/:mid')
  @UseGuards(ProjectMemberGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Project member removed.',
  })
  @ApiNotFoundResponse({
    description: 'Project/Member not found.',
  })
  async removeProjectMember(
    @Param('id', ParseIntPipe) pid: number,
    @Param('mid', ParseIntPipe) mid: number,
  ): Promise<{ data: GetProjectMemberDto }> {
    const result = await this.projectService.removeProjectMember(pid, mid);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id/members/:mid/role/:rid')
  @UseGuards(ProjectMemberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project members role changed.',
  })
  @ApiNotFoundResponse({
    description: 'Project/Member or role not found.',
  })
  async changeProjectMemberRole(
    @Param('id', ParseIntPipe) pid: number,
    @Param('mid', ParseIntPipe) mid: number,
    @Param('rid', ParseIntPipe) rid: number,
  ): Promise<{ data: GetProjectMemberDto }> {
    const result = await this.projectService.changeProjectMemberRole(
      pid,
      mid,
      rid,
    );

    if (result) return { data: result };

    throw new NotFoundException();
  }
}
