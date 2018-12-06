import React, { FC } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { FooItem } from './FooItem';

/**
 * Example of a component that has components exclusively associated to
 * it.
 */

interface Foo {
  bar: string;
}

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
