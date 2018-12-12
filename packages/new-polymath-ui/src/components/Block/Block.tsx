import React from 'react';
import styled from 'styled-components';

import { Box, BoxProps } from '../Box';

export interface BlockProps extends BoxProps {}

export const Block = styled(Box)<BlockProps>`
  display: block;
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const BlockDocz = (props: BlockProps) => {
  return <Block {...props} />;
};
