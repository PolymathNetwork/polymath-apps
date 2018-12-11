import React from 'react';
import styled from 'styled-components';

import { Box, BoxProps } from '../Box';

export const Block = styled(Box)<BoxProps>`
  display: block;
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const BlockDocz = (props: BoxProps) => {
  return <Block {...props} />;
};
