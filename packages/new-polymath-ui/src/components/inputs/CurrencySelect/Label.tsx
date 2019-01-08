import React, { FC } from 'react';

import styled, { withTheme, ThemeInterface } from '~/styles';
import { Box } from '~/components/Box';
import { IconCircled } from '~/components/IconCircled';
import { ellipsis } from '~/components/../styles/utils';

export interface LabelProps {
  Asset: React.ComponentType | string;
  text: string;
  theme: ThemeInterface;
  id: any;
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

const LabelPrimitive: FC<LabelProps> = ({ Asset, text, theme, id }) => (
  <Wrapper>
    <IconCircled
      Asset={Asset}
      color={theme.cryptoCurrencies[id].color}
      bg={theme.cryptoCurrencies[id].backgroundColor}
      width={25}
      height={25}
    />
    <Text>{text}</Text>
  </Wrapper>
);

export const Label = withTheme(LabelPrimitive);
