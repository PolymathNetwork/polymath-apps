// @flow

import mongoose from 'mongoose';

export class AuthCodeDocument /* :: extends Mongoose$Document */ {
  code: string;
  address: string;
}

const schema = new mongoose.Schema(
  {
    code: String,
    address: String,
  },
  { timestamps: true }
);

schema.index({ code: 1 });

schema.loadClass(AuthCodeDocument);

export const AuthCode = mongoose.model('AuthCode', schema);
