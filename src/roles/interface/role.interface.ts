import { Document, Types } from 'mongoose';
import { isDate } from 'util/types';

export interface Role extends Document {
  _id: Types.ObjectId;
  description: String;
  permissions: {
    project: String;
    canRole: {
      view: Boolean;
      update: Boolean;
      create: Boolean;
      delete: Boolean;
    };
  }[];
}
