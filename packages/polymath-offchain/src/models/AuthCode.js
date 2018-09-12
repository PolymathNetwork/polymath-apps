// @flow

import mongoose from 'mongoose';

export default mongoose.model(
  'AuthCode',
  new mongoose.Schema(
    {
      code: { type: String, index: true },
      address: String,
    },
    { timestamps: true }
  )
);
