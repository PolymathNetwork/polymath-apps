import React, { FC } from 'react';
import { formatters } from '@polymathnetwork/new-shared';

import * as S from './styles';

import { Paragraph } from '../Paragraph';

interface RaisedAmountProps {
  title: string;
  primaryAmount: number;
  primaryUnit: string;
  tokenAmount: number;
  tokenUnit: string;
}

export const RaisedAmount: FC<RaisedAmountProps> = ({
  title,
  primaryAmount,
  primaryUnit,
  tokenAmount,
  tokenUnit,
}) => (
  <S.Wrapper>
    <Paragraph as="h4" fontSize={1} color="highlightText" mb={1}>
      {title}
    </Paragraph>
    <Paragraph fontSize={5} color="highlightText" mb={1}>
      {`${formatters.thousandsDelimiter(primaryAmount)} ${primaryUnit}`}
    </Paragraph>
    {`${formatters.thousandsDelimiter(tokenAmount)} ${tokenUnit}`}
  </S.Wrapper>
);
