import React, { FC } from 'react';
import styled from 'styled-components';

import { Box } from '~/components/Box';
import { Icon } from '~/components/Icon';
import { ellipsis } from '~/styles/utils';

export interface LabelProps {
  Asset: React.ComponentType | string;
  text: string;
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

export const Label: FC<LabelProps> = ({ Asset, text }) => (
  <Wrapper>
    <Icon Asset={Asset} width={25} height={25} />
    <Text>{text}</Text>
  </Wrapper>
);
