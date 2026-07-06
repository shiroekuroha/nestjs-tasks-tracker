import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enum/task.enum';
import { TrackerService } from './tracker.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/guards/auth.guard';
import { RoleGuard } from 'src/guard/guards/role.guard';
import { CreateNewTaskDto } from './dto/create-new-task.dto';

@Controller('tasks')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get()
  @ApiOperation({ summary: 'Get all existing tasks' })
  getAllTasks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.trackerService.findAll(page, limit);
  }

  @Get(':project')
  @ApiOperation({ summary: 'Get existing tasks belongs to project' })
  @UseGuards(AuthGuard, RoleGuard)
  getProjectTasks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param('project') project: string,
  ) {
    return this.trackerService.getProjectTasks(project, page, limit);
  }

  @Get(':project/todo')
  @ApiOperation({ summary: 'Get existing todo tasks belongs to project' })
  @UseGuards(AuthGuard, RoleGuard)
  getTodoTasks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param('project') project: string,
  ) {
    return this.trackerService.findCategory(
      project,
      TaskStatus.TODO,
      page,
      limit,
    );
  }

  @Get(':project/in-progress')
  @ApiOperation({
    summary: 'Get existing in-progress tasks belongs to project',
  })
  @UseGuards(AuthGuard, RoleGuard)
  getInProgressTasks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param('project') project: string,
  ) {
    return this.trackerService.findCategory(
      project,
      TaskStatus.IN_PROGRESS,
      page,
      limit,
    );
  }

  @Get(':project/done')
  @ApiOperation({ summary: 'Get existing done tasks belongs to project' })
  @UseGuards(AuthGuard, RoleGuard)
  getDoneTasks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param('project') project: string,
  ) {
    return this.trackerService.findCategory(
      project,
      TaskStatus.DONE,
      page,
      limit,
    );
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
