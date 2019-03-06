import * as React from 'react';
import styled, { StyledProps } from 'styled-components';
import {
  minWidth,
  MinWidthProps,
  maxWidth,
  MaxWidthProps,
  width,
  WidthProps,
  height,
  HeightProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from 'styled-system';

export type BoxProps = StyledProps<any> &
  MinWidthProps &
  MaxWidthProps &
  WidthProps &
  HeightProps &
  SpaceProps &
  TextAlignProps;

export const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  ${minWidth};
  ${maxWidth};
  ${width};
  ${height};
  ${textAlign};
  ${space};
`;

// // TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const BoxDocz = (props: BoxProps) => {
  return <Box {...props} />;
};
