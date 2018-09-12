// @flow

import mongoose from 'mongoose';

export default mongoose.model(
  'User',
  new mongoose.Schema(
    {
      address: { type: String, unique: true },
      email: { type: String, index: true },
      name: String,
    },
    { timestamps: true }
  )
);
