import React from 'react';
import styled from 'styled-components';

import { Box } from '../../../Box';
import { Icon } from '../../../Icon';
import { ellipsis } from '../../../../styles/utils';

export interface LabelProps {
  Asset: React.ComponentType;
  text: React.ComponentType;
}

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

export const Label = ({ Asset, text }) => (
  <Container>
    <Icon Asset={Asset} alt={text} />
    <Text>{text}</Text>
  </Container>
);
