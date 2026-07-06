import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    meta: { type: [Object], required: false}
  },
  {
    collection: 'users',
  },
);
