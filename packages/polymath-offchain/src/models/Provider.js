// @flow

import mongoose from 'mongoose';

export class ProviderDocument /* :: extends Mongoose$Document */ {
  id: number | string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    id: Number,
    email: String,
    name: String,
  },
  { timestamps: true }
);

schema.index({ id: 1 }, { unique: true });
schema.index({ email: 1 });
schema.loadClass(ProviderDocument);

export const Provider = mongoose.model('Provider', schema);
