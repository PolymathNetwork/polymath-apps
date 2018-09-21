// @flow

import mongoose from 'mongoose';

export class EmailDocument /* :: extends Mongoose$Document */ {
  txHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    txHash: { type: String, unique: true },
  },
  { timestamps: true }
);

schema.index({ txHash: 1 }, { unique: true });
schema.loadClass(EmailDocument);

export const Email = mongoose.model('Email', schema);
