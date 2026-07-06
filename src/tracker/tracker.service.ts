import { Model } from 'mongoose';
import { Observable, from } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';

import { CreateServerTaskDto } from './dto/create-server-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enum/task.enum';
import { Task } from './interface/task.interface';

@Injectable()
export class TrackerService {
  constructor(
    @Inject('TASK_MODEL')
    private taskModel: Model<Task>,
  ) {}

  getCount(): Observable<number> {
    return from(this.taskModel.countDocuments().exec());
  }

  getProjectTasks(project: string): Observable<Task[]> {
    return from(this.taskModel.find({project: project}).exec());
  }

  findAll(skip: number = 0, max: number = 10): Observable<Task[] | null> {
    return from(this.taskModel.find().skip(skip).limit(max).exec());
  }

  findCategory(project: string, status: TaskStatus): Observable<Task[] | null> {
    return from(
      this.taskModel.aggregate([
        {
          $match: { project: project, status: status },
        },
      ]),
    );
  }

  find(id: string): Observable<Task | null> {
    return from(this.taskModel.findById(id).exec());
  }

  modify(id: string, updatedDto: CreateTaskDto): Observable<Task | null> {
    return from(
      this.taskModel
        .findByIdAndUpdate(
          id,
          {
            project: updatedDto.project,
            description: updatedDto.description,
            status: updatedDto.status,
            updatedAt: new Date(),
          },
          { returnDocument: 'after' }
        )
        .exec(),
    );
  }

  create(createTaskDto: CreateTaskDto): Observable<Task> {
    let transformed: CreateServerTaskDto = {
      project: createTaskDto.project,
      description: createTaskDto.description,
      status: createTaskDto.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(this.taskModel.create(transformed));
  }

  delete(id: string): Observable<Task | null> {
    return from(this.taskModel.findByIdAndDelete(id).exec());
  }
}
