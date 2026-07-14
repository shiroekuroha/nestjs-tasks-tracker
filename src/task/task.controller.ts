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
import { TaskGuard } from '../security/guards/task.guard';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { CreateCheckListDto } from './dto/create-checklist.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAttachmentDto } from './dto/get-attachment.dto';
import { GetChecklistDto } from './dto/get-checklist.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(AuthGuard, TaskGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseInterceptors(AnalyticsInterceptor)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Tasks found.' })
  async getTasks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    data: GetTaskDto[];
    meta: {
      page: number;
      item: number;
      total_pages: number;
      total_items: number;
    };
  }> {
    const def_page: number = 1;
    const def_limit: number = 10;
    const result = await this.taskService.getTasks(
      (page ?? def_page > 0) ? (page ?? def_page) : def_page,
      (limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit,
    );
    const count = await this.taskService.getTaskCount();

    return {
      data: plainToInstance(GetTaskDto, result, {
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
  @ApiOkResponse({ description: 'Task found.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  async getTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetTaskDto }> {
    const result = await this.taskService.getTask(id);

    if (result) return { data: result };

    throw new NotFoundException();
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Task updated.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ): Promise<{ data: GetTaskDto }> {
    return { data: await this.taskService.updateTask(id, data) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Put(':id/:taskGroupId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Task updated.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  async relinkTask(
    @Param('id', ParseIntPipe) id: number,
    @Param('taskGroupId', ParseIntPipe) taskGroupId: number,
  ): Promise<{ data: GetTaskDto }> {
    return { data: await this.taskService.relinkTask(id, taskGroupId) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post(':taskGroupId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Task created.' })
  async createTask(
    @Body() data: CreateTaskDto,
    @Param('taskGroupId', ParseIntPipe) taskGroupId: number,
  ): Promise<{ data: GetTaskDto | null }> {
    return {
      data: await this.taskService.createTask(data, taskGroupId),
    };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Task deleted.' })
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetTaskDto }> {
    return { data: await this.taskService.deleteTask(id) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post('attachments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Attachment created.' })
  async addAttachment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateAttachmentDto,
  ): Promise<{ data: GetAttachmentDto }> {
    return { data: await this.taskService.addAttachment(id, data) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete('attachments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Attachment deleted.' })
  async removeAttachment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetAttachmentDto }> {
    return { data: await this.taskService.removeAttachment(id) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Post('checklists/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Checklist created.' })
  async addChecklist(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateCheckListDto,
  ): Promise<{ data: GetChecklistDto }> {
    return { data: await this.taskService.addCheckList(id, data) };
  }

  @UseInterceptors(AnalyticsInterceptor)
  @Delete('checklists/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Checklist deleted.' })
  async removeChecklist(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: GetChecklistDto }> {
    return { data: await this.taskService.removeCheckList(id) };
  }
}
