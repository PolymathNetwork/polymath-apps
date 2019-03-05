import React from 'react';
import styled from 'styled-components';
import {
  alignItems,
  AlignItemsProps,
  justifyContent,
  JustifyContentProps,
  flex,
  FlexProps as CSSFlexProps,
  flexWrap,
  FlexWrapProps,
  flexDirection,
  FlexDirectionProps,
  alignSelf,
  AlignSelfProps,
} from 'styled-system';

import { Box, BoxProps } from '~/components/Box';

export type FlexProps = BoxProps &
  AlignItemsProps &
  AlignSelfProps &
  JustifyContentProps &
  CSSFlexProps &
  FlexDirectionProps &
  FlexWrapProps;

export const Flex = styled(Box)<FlexProps>`
  display: flex;

  ${flex};
  ${flexWrap};
  ${alignSelf};
  ${alignItems};
  ${flexDirection};
  ${justifyContent};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const FlexDocz = (props: FlexProps) => {
  return <Flex {...props} />;
};

Flex.defaultProps = {
  alignItems: 'center',
};
