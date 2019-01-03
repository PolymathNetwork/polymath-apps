import React, { FC } from 'react';
import { types } from '@polymathnetwork/new-shared';

interface Props {
  transaction: types.Transaction; // Should use shared type if it exists
}

export const FooItem: FC<Props> = ({ transaction }) => (
  <div>{transaction.hash}</div>
);
