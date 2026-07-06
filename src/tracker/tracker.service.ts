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

  find(id: string, project: string) :Observable<Task | null> {
    return  from(
      this.taskModel.aggregate([
        {
          $match: { _id: id,  project: project },
        },
      ]),
    );
  }

  modify(id: string, project: string, updatedDto: CreateTaskDto): Observable<Task | null> {
    return from(
      this.taskModel
        .findOneAndUpdate(
          {_id: id, project: project },
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

  create(project: string, createNewTaskDto: CreateNewTaskDto): Observable<Task> {
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
    return from(this.taskModel.findOneAndDelete({_id: id, project: project}).exec());
  }
}
