import React, { FC } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { FooItem } from './FooItem';

/**
 * Example of a function component that has components that are only associated to
 * it.
 */

interface Props {
  transactions: types.Transaction[];
}

export const FooList: FC<Props> = ({ transactions }) => (
  <div>
    {transactions.map(transaction => (
      <FooItem transaction={transaction} />
    ))}
  </div>
);
