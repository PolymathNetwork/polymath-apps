import React, { FC } from 'react';
import { formatters } from '@polymathnetwork/new-shared';

interface TextEllipsisProps {
  size: number;
  children: string;
}

export const TextEllipsis: FC<TextEllipsisProps> = props => {
  const { children, size, ...rest } = props;
  return <span {...rest}>{formatters.toShortAddress(children, { size })}</span>;
};
