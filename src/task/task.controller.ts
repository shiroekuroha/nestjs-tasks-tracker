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

  @Get()
  @HttpCode(HttpStatus.OK)
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

    page = (page ?? def_page > 0) ? (page ?? def_page) : def_page;
    limit = (limit ?? def_limit > 0) ? (limit ?? def_limit) : def_limit;

    const result = await this.taskService.getTasks(page, limit);
    const count = await this.taskService.getTaskCount();

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
  async getTask(@Param('id', ParseIntPipe) id: number): Promise<GetTaskDto> {
    const result = await this.taskService.getTask(id);

    if (result) return result;

    throw new NotFoundException();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ): Promise<GetTaskDto> {
    return await this.taskService.updateTask(id, data);
  }

  @Put(':id/:taskGroupId')
  @HttpCode(HttpStatus.OK)
  async relinkTask(
    @Param('id', ParseIntPipe) id: number,
    @Param('taskGroupId', ParseIntPipe) taskGroupId: number,
  ): Promise<{ result: string }> {
    return await this.taskService.relinkTask(id, taskGroupId);
  }

  @Post(':taskGroupId')
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body() data: CreateTaskDto,
    @Param('taskGroupId', ParseIntPipe) taskGroupId: number,
  ): Promise<GetTaskDto | null> {
    return await this.taskService.createTask(data, taskGroupId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<GetTaskDto> {
    return this.taskService.deleteTask(id);
  }

  @Post('attachments/:id')
  @HttpCode(HttpStatus.CREATED)
  async createAttachment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateAttachmentDto,
  ): Promise<GetAttachmentDto> {
    return await this.taskService.addAttachment(id, data);
  }

  @Delete('attachments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAttachment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetAttachmentDto> {
    return await this.taskService.removeAttachment(id);
  }

  @Post('checklists/:id')
  @HttpCode(HttpStatus.CREATED)
  async createChecklist(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateCheckListDto,
  ): Promise<GetChecklistDto> {
    return await this.taskService.addCheckList(id, data);
  }

  @Delete('checklists/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteChecklist(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetChecklistDto> {
    return await this.taskService.removeCheckList(id);
  }
}
