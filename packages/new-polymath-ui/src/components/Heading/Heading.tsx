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

import { Box } from '~/components/Box';

const headingStyle = variant({
  key: 'headings',
});

export type HeadingProps = {
  variant: 'h1' | 'h2' | 'h3' | 'h4';
} & ColorProps &
  FontWeightProps &
  FontSizeProps &
  LineHeightProps;

const StyledHeading = styled(Box)<HeadingProps>`
  ${headingStyle};
  ${color};
  ${fontWeight};
  ${lineHeight};
  ${fontSize};
  width: 100%;
  word-wrap: break-word;
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const HeadingDocz: FC<HeadingProps> = (props: any) => {
  return <Heading {...props} />;
};

export const Heading = Object.assign(StyledHeading, {
  defaultProps: {
    as: 'h2',
    variant: 'h3',
    lineHeight: 'normal',
    mt: 0,
    mb: 'm',
  },
});
