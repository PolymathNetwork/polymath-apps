// @flow

import mongoose from 'mongoose';

export class EmailPINDocument /* :: extends Mongoose$Document */ {
  pin: string;
  email: string;
  address: string;
  isConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    pin: String,
    email: String,
    address: String,
    isConfirmed: Boolean,
  },
  { timestamps: true }
);

schema.index({ pin: 1 });
schema.loadClass(EmailPINDocument);

export const EmailPIN = mongoose.model('EmailPIN', schema);
