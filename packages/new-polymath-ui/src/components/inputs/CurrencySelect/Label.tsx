import React, { FC } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { withTheme, ThemeInterface, styled } from '~/styles';
import { Box } from '~/components/Box';
import { IconCircled } from '~/components/IconCircled';
import { ellipsis } from '~/components/../styles/utils';

interface Props {
  Asset: React.ComponentType | string;
  text: string;
  theme: ThemeInterface;
  token: types.Tokens;
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

const LabelPrimitive: FC<Props> = ({ Asset, text, theme, token }) => (
  <Wrapper>
    <IconCircled
      Asset={Asset}
      color={theme.tokens[token].color}
      bg={theme.tokens[token].backgroundColor}
      width={25}
      height={25}
    />
    <Text>{text}</Text>
  </Wrapper>
);

export const Label = withTheme(LabelPrimitive);
