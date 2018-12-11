import React from 'react';
import styled from 'styled-components';
import {
  space,
  SpaceProps,
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
  textAlign,
  TextAlignProps,
} from 'styled-system';

export type ParagraphProps = { bold: boolean } & SpaceProps &
  ColorProps &
  FontFamilyProps &
  FontWeightProps &
  FontSizeProps &
  LineHeightProps &
  LetterSpacingProps &
  TextAlignProps;

export const Paragraph = styled.p<ParagraphProps>(
  space,
  color,
  fontFamily,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontSize,
  textAlign,
  props => props.bold && fontWeight({ ...props, fontWeight: 'bold' })
);

export const ParagraphDocz = (props: ParagraphProps) => {
  return <Paragraph {...props} />;
};

Paragraph.defaultProps = {
  mt: 0,
  mb: 'm',
  fontSize: 'baseText',
};
