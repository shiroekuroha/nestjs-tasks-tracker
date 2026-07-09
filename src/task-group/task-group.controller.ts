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
import { TaskGroupGuard } from '../security/guards/task-group.guard';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { GetTaskGroupDto } from './dto/get-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { TaskGroupService } from './task-group.service';

@Controller('task-groups')
@UseGuards(AuthGuard, TaskGroupGuard)
export class TaskGroupController {
  constructor(private readonly task_groupService: TaskGroupService) {}

  @UseInterceptors(AnalyticsInterceptor)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroups found.' })
  async getTaskGroups(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    data: GetTaskGroupDto[];
    meta: {
      page: number;
      item: number;
      total_pages: number;
      total_items: number;
    };
  }> {
    const def_page: number = 1;
    const def_limit: number = 10;
    const result = await this.task_groupService.getTaskGroups(
      page ?? def_page,
      limit ?? def_limit,
    );
    const count = await this.task_groupService.getTaskGroupCount();

    return {
      data: plainToInstance(GetTaskGroupDto, result, {
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
  @ApiOkResponse({ description: 'TaskGroup found.' })
  @ApiNotFoundResponse({ description: 'TaskGroup not found.' })
  async getTaskGroup(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetTaskGroupDto }> {
    const result = await this.task_groupService.getTaskGroup(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup updated.' })
  @ApiNotFoundResponse({ description: 'TaskGroup not found.' })
  async updateTaskGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskGroupDto,
  ): Promise<{ data: GetTaskGroupDto }> {
    const result = await this.task_groupService.updateTaskGroup(id, data);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id/:project_id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup updated.' })
  @ApiNotFoundResponse({ description: 'TaskGroup not found.' })
  async relinkTaskGroup(
    @Param('id', ParseIntPipe) id: number,
    @Param('project_id', ParseIntPipe) project_id: number,
  ): Promise<{ data: GetTaskGroupDto }> {
    const result = await this.task_groupService.relinkTaskGroup(id, project_id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post(':project_id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup created.' })
  async createTaskGroup(
    @Body() data: CreateTaskGroupDto,
    @Param('project_id', ParseIntPipe) project_id: number,
  ): Promise<{ data: GetTaskGroupDto }> {
    return {
      data: await this.task_groupService.createTaskGroup(data, project_id),
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'TaskGroup created.' })
  async deleteTaskGroup(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetTaskGroupDto }> {
    const result = await this.task_groupService.deleteTaskGroup(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }
}
