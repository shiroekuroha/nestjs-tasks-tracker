import { Document, Types } from 'mongoose';
import { isDate } from 'util/types';
import { TaskStatus } from '../enum/task.enum';

export interface Task extends Document {
  _id: Types.ObjectId;
  project: String;
  description: String;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
