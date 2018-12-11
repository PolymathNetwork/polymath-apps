import React from 'react';
import styled from 'styled-components';

import { Box, BoxProps } from '../Box';

export interface PageWrapProps extends BoxProps {}

export const PageWrap = styled(Box)<PageWrapProps>`
  max-width: ${({ theme }) => theme.maxWidth};
  padding-left: calc(${({ theme }) => `${theme.sidebar.width} + 2%`});
  padding-right: calc(${({ theme }) => `${theme.sidebar.width} + 2%`});
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const PageWrapDocz = (props: PageWrapProps) => {
  return <PageWrap {...props} />;
};

PageWrap.defaultProps = {
  mx: 'auto',
};
