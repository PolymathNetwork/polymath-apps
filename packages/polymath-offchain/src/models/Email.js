// @flow

import mongoose from 'mongoose';

export default mongoose.model(
  'Email',
  new mongoose.Schema(
    {
      txHash: { type: String, unique: true },
    },
    { timestamps: true }
  )
);
