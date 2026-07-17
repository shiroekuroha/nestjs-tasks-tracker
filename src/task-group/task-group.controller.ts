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
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AuthGuard } from '../security/guards/auth.guard';
import { TaskGroupGuard } from '../security/guards/task-group.guard';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { GetTaskGroupDto } from './dto/get-task-group.dto';
import { GetTaskReorderDto } from './dto/get-task-reorder.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { TaskGroupService } from './task-group.service';

@Controller('taskGroups')
@UseGuards(AuthGuard, TaskGroupGuard)
export class TaskGroupController {
  constructor(private readonly taskGroupService: TaskGroupService) {}

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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup found.' })
  @ApiNotFoundResponse({ description: 'TaskGroup not found.' })
  async getTaskGroup(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetTaskGroupDto> {
    const result = await this.taskGroupService.getTaskGroup(id);

    if (result) return result;

    throw new NotFoundException();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup updated.' })
  async updateTaskGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskGroupDto,
  ): Promise<GetTaskGroupDto> {
    return await this.taskGroupService.updateTaskGroup(id, data);
  }

  @Put(':id/reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup updated.' })
  async reorderTaskGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: GetTaskReorderDto,
  ): Promise<any> {
    return await this.taskGroupService.reorderTask(id, data);
  }

  @Put(':id/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'TaskGroup updated.' })
  async relinkTaskGroup(
    @Param('id', ParseIntPipe) id: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<{ result: string }> {
    return await this.taskGroupService.relinkTaskGroup(id, projectId);
  }

  @Post(':projectId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'TaskGroup created.' })
  async createTaskGroup(
    @Body() data: CreateTaskGroupDto,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<GetTaskGroupDto> {
    return await this.taskGroupService.createTaskGroup(data, projectId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'TaskGroup created.' })
  async deleteTaskGroup(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetTaskGroupDto> {
    return await this.taskGroupService.deleteTaskGroup(id);
  }
}
