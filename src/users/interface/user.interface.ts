import { Document, Types } from 'mongoose';
import { isDate } from 'util/types';

export interface User extends Document {
  _id: Types.ObjectId;
  username: String;
  password: String;
  roleId: String;
  meta: [any];
}
