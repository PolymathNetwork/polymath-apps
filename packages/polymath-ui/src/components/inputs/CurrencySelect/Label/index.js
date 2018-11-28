import React from 'react';
import styled from 'styled-components';

import Box from '../../../Box';
import { ellipsis } from '../../../../styles/utils';

const Container = styled(Box)`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const Text = styled.span`
  margin-left: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  ${ellipsis};
`;

const Label = ({ icon, text }) => (
  <Container>
    <img src={icon} alt={text} />
    <Text>{text}</Text>
  </Container>
);

export default Label;
