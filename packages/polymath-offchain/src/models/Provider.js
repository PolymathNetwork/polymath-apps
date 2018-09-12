// @flow

import mongoose from 'mongoose';

export default mongoose.model(
  'Provider',
  new mongoose.Schema(
    {
      id: { type: Number, unique: true },
      email: { type: String, index: true },
      name: String,
    },
    { timestamps: true }
  )
);
