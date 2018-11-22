import styled from 'styled-components';
import {
  space,
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing,
  fontSize,
} from 'styled-system';

export const Paragraph = styled.p(
  space,
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing,
  fontSize
);

export default Paragraph;

Paragraph.defaultProps = {
  mb: 2,
};
