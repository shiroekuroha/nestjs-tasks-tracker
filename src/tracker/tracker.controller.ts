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
import { ApiOperation } from '@nestjs/swagger';
import { CreateNewTaskDto } from './dto/create-new-task.dto';

@Controller('tasks')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get('count')
  @ApiOperation({ summary: 'Get number of existing tasks' })
  getCount() {
    return this.trackerService.getCount();
  }

  @Get()
  @ApiOperation({ summary: 'Get all existing tasks' })
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
  @ApiOperation({ summary: 'Get existing tasks belongs to project' })
  @UseGuards(AuthGuard, RoleGuard)
  getProjectTasks(@Param('project') project: string) {
    return this.trackerService.getProjectTasks(project);
  }

  @Get(':project/todo')
  @ApiOperation({ summary: 'Get existing todo tasks belongs to project' })
  @UseGuards(AuthGuard, RoleGuard)
  getTodoTasks(@Param('project') project: string) {
    return this.trackerService.findCategory(project, TaskStatus.TODO);
  }

  @Get(':project/in-progress')
  @ApiOperation({
    summary: 'Get existing in-progress tasks belongs to project',
  })
  @UseGuards(AuthGuard, RoleGuard)
  getInProgressTasks(@Param('project') project: string) {
    return this.trackerService.findCategory(project, TaskStatus.IN_PROGRESS);
  }

  @Get(':project/done')
  @ApiOperation({ summary: 'Get existing done tasks belongs to project' })
  @UseGuards(AuthGuard, RoleGuard)
  getDoneTasks(@Param('project') project: string) {
    return this.trackerService.findCategory(project, TaskStatus.DONE);
  }

  @Get(':project/:id')
  @ApiOperation({
    summary: 'Get existing tasks by id, task must have correct project',
  })
  @UseGuards(AuthGuard, RoleGuard)
  getTaskById(@Param('project') project: string, @Param('id') id: string) {
    return this.trackerService.find(id, project);
  }

  @Put(':project/:id')
  @ApiOperation({
    summary: "Get existing tasks by id, modify task using Body's JSON",
  })
  @UseGuards(AuthGuard, RoleGuard)
  modifyTask(
    @Param('project') project: string,
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.trackerService.modify(id, project, createTaskDto);
  }

  @Post(':project')
  @ApiOperation({ summary: "Create new tasks, using Body's JSON" })
  @UseGuards(AuthGuard, RoleGuard)
  createTask(
    @Param('project') project: string,
    @Body() createNewTaskDto: CreateNewTaskDto,
  ) {
    return this.trackerService.create(project, createNewTaskDto);
  }

  @Delete(':project/:id')
  @ApiOperation({ summary: "Delete existing tasks, using Param's id" })
  @UseGuards(AuthGuard, RoleGuard)
  deleteTask(@Param('id') id: string, @Param('project') project: string) {
    return this.trackerService.delete(project, id);
  }
}
