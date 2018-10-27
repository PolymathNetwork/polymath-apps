import React from 'react';
import styled from 'styled-components';

import Paragraph from '../Paragraph';

import './style.scss';

const Container = styled.div`
  padding: 10px 15px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.blue[0]};
`;

const LightText = styled.span`
  color: ${({ theme }) => theme.colors.gray[2]};
`;

const RaisedAmount = ({ title, primaryAmount, tokenAmount }) => (
  <Container>
    <Paragraph as="h4" fontSize={1} mb={3}>
      {title}
    </Paragraph>
    <Paragraph fontSize={5} mb={2}>
      {primaryAmount}
    </Paragraph>
    <LightText>{tokenAmount}</LightText>
  </Container>
);

export default RaisedAmount;
