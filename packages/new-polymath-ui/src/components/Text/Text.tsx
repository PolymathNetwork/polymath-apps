import React, { FC } from 'react';
import styled from 'styled-components';
import {
  color,
  ColorProps,
  fontFamily,
  FontFamilyProps,
  fontWeight,
  FontWeightProps,
  lineHeight,
  LineHeightProps,
  fontSize,
  FontSizeProps,
} from 'styled-system';
import { Box, BoxProps } from '~/components/Box';

export type TextProps = { bold?: boolean } & BoxProps &
  ColorProps &
  FontFamilyProps &
  FontWeightProps &
  FontSizeProps &
  LineHeightProps;

export const Text = styled(Box)<TextProps>`
  ${color};
  ${fontFamily};
  ${fontWeight};
  ${lineHeight};
  ${fontSize};
  ${props => props.bold && fontWeight({ ...props, fontWeight: 'bold' })};
  overflow-wrap: break-word;

  > * {
    vertical-align: middle;
  }
`;

export const TextDocz: FC<TextProps> = (props: any) => {
  return <Text {...props} />;
};

Text.defaultProps = {
  as: 'span',
  fontSize: 'baseText',
  lineHeight: 'normal',
};
