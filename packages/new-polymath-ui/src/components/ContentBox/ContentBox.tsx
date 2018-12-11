import React from 'react';
import styled from 'styled-components';

import { Box, BoxProps } from '../Box';

export interface ContentBoxProps extends BoxProps {}

export const ContentBox = styled(Box)<ContentBoxProps>`
  background-color: white;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.space[6]};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const ContentBoxDocz = (props: ContentBoxProps) => {
  return <ContentBox {...props} />;
};
