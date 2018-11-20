import styled from 'styled-components';
import {
  space,
  fontFamily,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontSize,
  textAlign,
} from 'styled-system';

export const Paragraph = styled.p(
  space,
  fontFamily,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontSize,
  textAlign
);

export default Paragraph;

Paragraph.defaultProps = {
  mb: 2,
};
