// @flow

import mongoose from 'mongoose';

export default mongoose.model(
  'EmailPIN',
  new mongoose.Schema(
    {
      pin: { type: String, index: true },
      email: { type: String },
      address: String,
      isConfirmed: Boolean,
    },
    { timestamps: true }
  )
);
