// @flow

import mongoose from 'mongoose';

export class UserDocument /* :: extends Mongoose$Document */ {
  address: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    address: String,
    email: String,
    name: String,
  },
  { timestamps: true }
);

schema.index({ address: 1 }, { unique: true });
schema.index({ email: 1 });
schema.loadClass(UserDocument);

export const User = mongoose.model('User', schema);
