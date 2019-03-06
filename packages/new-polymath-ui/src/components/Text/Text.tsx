import React, { FC } from 'react';
import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';
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
import { Box } from '~/components/Box';

type BoxProps = typeHelpers.GetProps<typeof Box>;

type Props = { bold?: boolean } & BoxProps &
  ColorProps &
  FontFamilyProps &
  FontWeightProps &
  FontSizeProps &
  LineHeightProps;

export const Text = styled(Box)<Props>`
  ${color};
  ${fontFamily};
  ${fontWeight};
  ${lineHeight};
  ${fontSize};
  ${props => props.bold && fontWeight({ ...props, fontWeight: 'bold' })};
  overflow-wrap: break-word;
`;

export const TextDocz: FC<Props> = (props: any) => {
  return <Text {...props} />;
};

Text.defaultProps = {
  as: 'span',
  fontSize: 'baseText',
  lineHeight: 'normal',
};
