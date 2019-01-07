import React from 'react';
import { get } from 'lodash';
import { darken } from 'polished';

import styled, { withTheme, ThemeInterface } from '~/styles';
import { Box } from '../../../Box';
import { IconCircled } from '../../../IconCircled';
import { ellipsis } from '../../../../styles/utils';

export interface LabelProps {
  Asset: React.ComponentType;
  text: React.ComponentType;
  color: string;
  theme: ThemeInterface;
}

const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const Text = styled.span`
  margin-left: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  ${ellipsis};
`;

export const Label = withTheme(({ Asset, text, id, theme }: LabelProps) => (
  <Wrapper>
    <IconCircled
      Asset={Asset}
      color={theme.cryptoCurrencies[id].color}
      bg={theme.cryptoCurrencies[id].backgroundColor}
      width="25"
      height="25"
    />
    <Text>{text}</Text>
  </Wrapper>
));
