import React from 'react';
import styled from 'styled-components';

import Paragraph from '../Paragraph';
import { thousandsDelimiter } from '../../helpers';

const Container = styled.div`
  padding: 10px 15px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.gray[1]};
`;

const RaisedAmount = ({
  title,
  primaryAmount,
  primaryUnit,
  tokenAmount,
  tokenUnit,
}) => (
  <Container>
    <Paragraph as="h4" fontSize={1} color="highlightText" mb={1}>
      {title}
    </Paragraph>
    <Paragraph fontSize={5} color="highlightText" mb={1}>
      {`${thousandsDelimiter(primaryAmount)} ${primaryUnit}`}
    </Paragraph>
    {`${thousandsDelimiter(tokenAmount)} ${tokenUnit}`}
  </Container>
);

export default RaisedAmount;
