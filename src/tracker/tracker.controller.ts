import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enum/task.enum';
import { TrackerService } from './tracker.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';

@Controller('tasks')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get('count')
  getCount() {
    return this.trackerService.getCount();
  }

  @Get()
  getAllTasks(@Query('skip') skip: number, @Query('max') max: number) {
    if (skip && max) {
      return this.trackerService.findAll(skip, max);
    }

    if (skip) {
      return this.trackerService.findAll(skip);
    }

    if (max) {
      return this.trackerService.findAll(0, max);
    }

    return this.trackerService.findAll();
  }

  @Get(':project')
  @UseGuards(AuthGuard, RoleGuard)
  getProjectTasks(@Param('project') project: string) {
    return this.trackerService.getProjectTasks(project);
  }

  @Get(':project/todo')
  @UseGuards(AuthGuard, RoleGuard)
  getTodoTasks(@Param('project') project: string) {
    return this.trackerService.findCategory(project, TaskStatus.TODO);
  }

  @Get(':project/in-progress')
  @UseGuards(AuthGuard, RoleGuard)
  getInProgressTasks(@Param('project') project: string) {
    return this.trackerService.findCategory(project, TaskStatus.IN_PROGRESS);
  }

  @Get(':project/done')
  @UseGuards(AuthGuard, RoleGuard)
  getDoneTasks(@Param('project') project: string) {
    return this.trackerService.findCategory(project, TaskStatus.DONE);
  }

  @Get(':project/:id')
  @UseGuards(AuthGuard, RoleGuard)
  getTaskById(@Param('project') project: string, @Param('id') id: string) {
    return this.trackerService.find(id);
  }

  @Put(':project/:id')
  @UseGuards(AuthGuard, RoleGuard)
  modifyTask(@Param('id') id: string, @Body() createTaskDto: CreateTaskDto) {
    return this.trackerService.modify(id, createTaskDto);
  }

  @Post(':project')
  @UseGuards(AuthGuard, RoleGuard)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.trackerService.create(createTaskDto);
  }

  @Delete(':project/:id')
  @UseGuards(AuthGuard, RoleGuard)
  deleteTask(@Param('id') id: string) {
    return this.trackerService.delete(id);
  }
}
