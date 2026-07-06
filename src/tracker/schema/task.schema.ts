import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema(
  {
    project: String,
    description: String,
    status: Number,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    collection: 'tasks',
  },
);
