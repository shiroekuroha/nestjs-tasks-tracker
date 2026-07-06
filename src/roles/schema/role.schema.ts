import * as mongoose from 'mongoose';

export const RoleSchema = new mongoose.Schema(
  {
    description: String,
    permissions: [
      {
        project: { type: String, required: true },
        canRole: {
          view: { type: Boolean, default: false },
          update: { type: Boolean, default: false },
          create: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
      },
    ],
  },
  {
    collection: 'roles',
  },
);
