import { Model } from 'mongoose';
import { Observable, forkJoin, from, map } from 'rxjs';

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

  getProjectTasks(project: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    return forkJoin({
      data: from(
        this.taskModel
          .find({ project: project })
          .skip(skip)
          .limit(limit)
          .exec(),
      ),
      total_count: from(
        this.taskModel.countDocuments({ project: project }).exec(),
      ),
    }).pipe(
      map(({ data, total_count }) => ({
        data,
        meta: {
          page,
          count: data.length,
          total_page: Math.ceil(total_count / limit),
          total_count: total_count,
        },
      })),
    );
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    return forkJoin({
      data: from(this.taskModel.find().skip(skip).limit(limit).exec()),
      total_count: from(this.taskModel.countDocuments().exec()),
    }).pipe(
      map(({ data, total_count }) => ({
        data,
        meta: {
          page,
          count: data.length,
          total_page: Math.ceil(total_count / limit),
          total_count: total_count,
        },
      })),
    );
  }
  
  findCategory(
    project: string,
    status: TaskStatus,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const filter = {
      project,
      status,
    };

    return forkJoin({
      data: from(
        this.taskModel
          .aggregate([{ $match: filter }])
          .skip(skip)
          .limit(limit)
          .exec(),
      ),
      total_count: from(this.taskModel.countDocuments(filter).exec()),
    }).pipe(
      map(({ data, total_count }) => ({
        data,
        meta: {
          page,
          count: data.length,
          total_page: Math.ceil(total_count / limit),
          total_count,
        },
      })),
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
