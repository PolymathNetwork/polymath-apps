import styled from 'styled-components';
import {
  fontFamily,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontSize,
} from 'styled-system';

import Box from '../Box';

export const Paragraph = styled(Box)(
  fontFamily,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontSize
);

export default Paragraph;

Paragraph.defaultProps = {
  mb: 2,
};
