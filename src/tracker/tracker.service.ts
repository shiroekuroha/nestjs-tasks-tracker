import { Model } from 'mongoose';
import { Observable, from } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';

import { CreateServerTaskDto } from './dto/create-server-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enum/task.enum';
import { Task } from './interface/task.interface';
import { CreateNewTaskDto } from './dto/create-new-task.dto';

@Injectable()
export class TrackerService {
  constructor(
    @Inject('TASK_MODEL')
    private taskModel: Model<Task>,
  ) {}

  getProjectTasks(
    project: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<Task[]> {
    const def_page = 1;
    const def_limit = 10;

    page = (page && page > 0 ? page : def_page) - 1;
    limit = limit && limit > 0 ? limit : def_limit;

    return from(
      this.taskModel
        .find({ project: project })
        .skip(page * limit)
        .limit(limit)
        .exec(),
    );
  }

  findAll(page: number = 1, limit: number = 10): Observable<Task[] | null> {
    const def_page = 1;
    const def_limit = 10;

    page = (page && page > 0 ? page : def_page) - 1;
    limit = limit && limit > 0 ? limit : def_limit;

    return from(
      this.taskModel
        .find()
        .skip(page * limit)
        .limit(limit)
        .exec(),
    );
  }

  findCategory(
    project: string,
    status: TaskStatus,
    page: number = 1,
    limit: number = 10,
  ): Observable<Task[] | null> {
    const def_page = 1;
    const def_limit = 10;

    page = (page && page > 0 ? page : def_page) - 1;
    limit = limit && limit > 0 ? limit : def_limit;

    return from(
      this.taskModel
        .aggregate([
          {
            $match: { project: project, status: status },
          },
        ])
        .skip(page * limit)
        .limit(limit)
        .exec(),
    );
  }

  find(
    id: string,
    project: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<Task | null> {
    return from(
      this.taskModel.aggregate([
        {
          $match: { _id: id, project: project },
        },
      ]),
    );
  }

  modify(
    id: string,
    project: string,
    updatedDto: CreateTaskDto,
  ): Observable<Task | null> {
    return from(
      this.taskModel
        .findOneAndUpdate(
          { _id: id, project: project },
          {
            project: updatedDto.project,
            description: updatedDto.description,
            status: updatedDto.status,
            updatedAt: new Date(),
          },
          { returnDocument: 'after' },
        )
        .exec(),
    );
  }

  create(
    project: string,
    createNewTaskDto: CreateNewTaskDto,
  ): Observable<Task> {
    let transformed: CreateServerTaskDto = {
      project: project,
      description: createNewTaskDto.description,
      status: createNewTaskDto.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(this.taskModel.create(transformed));
  }

  delete(project: string, id: string): Observable<Task | null> {
    return from(
      this.taskModel.findOneAndDelete({ _id: id, project: project }).exec(),
    );
  }
}
