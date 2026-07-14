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

@Controller('taskGroups')
@UseGuards(AuthGuard, TaskGroupGuard)
export class TaskGroupController {
  constructor(private readonly taskGroupService: TaskGroupService) {}

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
    const result = await this.taskGroupService.getTaskGroups(
      (page ?? def_page > 0) ? (page ?? def_page) : def_page,
      (limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit,
    );
    const count = await this.taskGroupService.getTaskGroupCount();

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
    const result = await this.taskGroupService.getTaskGroup(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup updated.' })
  async updateTaskGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskGroupDto,
  ): Promise<{ data: GetTaskGroupDto }> {
    return { data: await this.taskGroupService.updateTaskGroup(id, data) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup updated.' })
  async relinkTaskGroup(
    @Param('id', ParseIntPipe) id: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<{ data: GetTaskGroupDto }> {
    return {
      data: await this.taskGroupService.relinkTaskGroup(id, projectId),
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post(':projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup created.' })
  async createTaskGroup(
    @Body() data: CreateTaskGroupDto,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<{ data: GetTaskGroupDto | null }> {
    return {
      data: await this.taskGroupService.createTaskGroup(data, projectId),
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'TaskGroup created.' })
  async deleteTaskGroup(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetTaskGroupDto }> {
    return { data: await this.taskGroupService.deleteTaskGroup(id) };
  }
}
