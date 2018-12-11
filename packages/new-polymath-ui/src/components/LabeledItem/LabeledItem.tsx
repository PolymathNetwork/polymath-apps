import React from 'react';
import styled from 'styled-components';

import { Paragraph } from '../Paragraph';
import { Box, BoxProps } from '../Box';

export const LabeledItem = styled(Box)`
  & + & {
    margin-top: ${({ theme }) => theme.space[4]};
  }

  ${Paragraph}:last-child {
    margin-bottom: 0;
  }
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const LabeledItemDocz = (props: BoxProps) => {
  return <LabeledItem {...props} />;
};
