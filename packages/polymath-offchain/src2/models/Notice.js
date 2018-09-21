// @flow

import mongoose from 'mongoose';

export class NoticeDocument /* :: extends Mongoose$Document */ {
  type: string;
  scope: string;
  title: string;
  content: string;
  isOneTime: boolean;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    type: { type: String, enum: ['error', 'warning', 'info'] },
    scope: { type: String, enum: ['all', 'issuers', 'investors'] },
    title: String,
    content: String,
    isOneTime: Boolean,
    isValid: Boolean,
  },
  { timestamps: true }
);

schema.loadClass(NoticeDocument);

export const Notice = mongoose.model('Notice', schema);
