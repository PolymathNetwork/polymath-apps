import React, { FC } from 'react';
import styled from 'styled-components';
import { formatters } from '@polymathnetwork/new-shared';

import { Paragraph } from '../Paragraph';

const Wrapper = styled.div`
  padding: 10px 15px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.gray[1]};
  min-width: 250px;
`;

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
  <Wrapper>
    <Paragraph as="h4" fontSize={1} color="highlightText" mb={1}>
      {title}
    </Paragraph>
    <Paragraph fontSize={5} color="highlightText" mb={1}>
      {`${formatters.thousandsDelimiter(primaryAmount)} ${primaryUnit}`}
    </Paragraph>
    {`${formatters.thousandsDelimiter(tokenAmount)} ${tokenUnit}`}
  </Wrapper>
);
