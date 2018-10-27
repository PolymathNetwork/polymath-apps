import React from 'react';
import styled from 'styled-components';

import Box from '../../../Box';
import { ellipsis } from '../../../../styles/utils';

import theme from '../../../../theme';

const Container = styled(Box)`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const Text = styled.span`
  ${ellipsis}
  margin-left: ${theme.space[3]}px;
  font-size: ${theme.fontSizes[1]}px;
`;

const Label = ({ icon, text }) => (
  <Container>
    <img src={icon} alt={text} />
    <Text>{text}</Text>
  </Container>
);

export default Label;
