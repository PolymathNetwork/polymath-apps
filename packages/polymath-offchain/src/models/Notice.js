// @flow

import mongoose from 'mongoose';

export default mongoose.model(
  'Notice',
  new mongoose.Schema(
    {
      type: { type: String, enum: ['error', 'warning', 'info'] },
      scope: { type: String, enum: ['all', 'issuers', 'investors'] },
      title: String,
      content: String,
      isOneTime: Boolean,
      isValid: Boolean,
    },
    { timestamps: true }
  )
);
