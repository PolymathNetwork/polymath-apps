import styled from 'styled-components';
import {
  space,
  color,
  fontFamily,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontSize,
  textAlign,
} from 'styled-system';

export const Paragraph = styled.p(
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

export default Paragraph;

Paragraph.defaultProps = {
  mb: 'm',
  fontSize: 'baseText',
};
