import React from 'react';
import styled from 'styled-components';
import Paragraph from '../Paragraph';
import { thousandsDelimiter } from '../../helpers';

import './style.scss';

const Container = styled.div`
  padding: 10px 15px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.blue[0]};
`;

const LightText = styled.span`
  color: ${({ theme }) => theme.colors.gray[2]};
`;

const RaisedAmount = ({
  title,
  primaryAmount,
  primaryUnit,
  tokenAmount,
  tokenUnit,
}) => (
  <Container>
    <Paragraph as="h4" fontSize={1} mb={3}>
      {title}
    </Paragraph>
    <Paragraph fontSize={5} mb={2}>
      {`${thousandsDelimiter(primaryAmount)} ${primaryUnit}`}
    </Paragraph>
    <LightText>{`${thousandsDelimiter(tokenAmount)} ${tokenUnit}`}</LightText>
  </Container>
);

export default RaisedAmount;
