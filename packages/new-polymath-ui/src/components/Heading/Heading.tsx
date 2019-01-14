import React, { FC } from 'react';
import styled from 'styled-components';
import {
  variant,
  color,
  ColorProps,
  fontWeight,
  FontWeightProps,
  lineHeight,
  LineHeightProps,
  fontSize,
  FontSizeProps,
} from 'styled-system';

import { Box, BoxProps } from '~/components/Box';

const headingStyle = variant({
  key: 'headings',
});

export type HeadingProps = {
  variant: 'h1' | 'h2' | 'h3' | 'h4';
} & ColorProps &
  FontWeightProps &
  FontSizeProps &
  LineHeightProps;

export const Heading = styled(Box)<HeadingProps>`
  ${headingStyle};
  ${color};
  ${fontWeight};
  ${lineHeight};
  ${fontSize};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const HeadingDocz: FC<HeadingProps> = (props: any) => {
  return <Heading {...props} />;
};

Heading.defaultProps = {
  as: 'h2',
  variant: 'h3',
  lineHeight: 'normal',
  mt: 0,
  mb: 'm',
};
