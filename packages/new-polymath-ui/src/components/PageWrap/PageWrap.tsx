import React from 'react';

import { styled } from '~/styles';
import { Box, BoxProps } from '~/components/Box';

export interface PageWrapProps extends BoxProps {}

export const PageWrap = styled(Box)<PageWrapProps>`
  max-width: ${({ theme }) => theme.maxWidth};
  padding-left: calc(${({ theme }) => theme.sidebar.width});
  padding-right: calc(${({ theme }) => theme.sidebar.width});
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const PageWrapDocz = (props: PageWrapProps) => {
  return <PageWrap {...props} />;
};

PageWrap.defaultProps = {
  mx: 'auto',
};
