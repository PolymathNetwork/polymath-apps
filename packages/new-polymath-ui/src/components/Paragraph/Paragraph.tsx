import React, { FC } from 'react';
import styled, { StyledComponentProps } from 'styled-components';
import {
  color,
  ColorProps,
  fontFamily,
  FontFamilyProps,
  fontWeight,
  FontWeightProps,
  lineHeight,
  LineHeightProps,
  letterSpacing,
  LetterSpacingProps,
  fontSize,
  FontSizeProps,
} from 'styled-system';
import { Box, BoxProps } from '~/components/Box';

export type ParagraphProps = { bold: boolean } & BoxProps &
  ColorProps &
  FontFamilyProps &
  FontWeightProps &
  FontSizeProps &
  LineHeightProps &
  LetterSpacingProps;

export const Paragraph = styled(Box)<ParagraphProps>`
  ${color};
  ${fontFamily};
  ${fontWeight};
  ${lineHeight};
  ${letterSpacing};
  ${fontSize};
  ${props => props.bold && fontWeight({ ...props, fontWeight: 'bold' })};

  &:last-child {
    margin-bottom: 0;
  }
`.withComponent('p');

export const ParagraphDocz: FC<ParagraphProps> = (props: any) => {
  return <Paragraph {...props} />;
};

Paragraph.defaultProps = {
  mt: 0,
  mb: 'm',
  fontSize: 'baseText',
};
