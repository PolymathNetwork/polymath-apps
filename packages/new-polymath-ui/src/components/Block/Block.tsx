import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '~/components/Box';

export interface BlockProps extends BoxProps {
  // TODO @RafaelVidaurre: Improve this typing as it has to dynamically account
  // for the `as` prop
  [key: string]: any;
}

export const Block = styled(Box)<BlockProps>`
  display: block;
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const BlockDocz = (props: BlockProps) => {
  return <Block {...props} />;
};
