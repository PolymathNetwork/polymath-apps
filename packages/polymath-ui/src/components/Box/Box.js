// @flow

import styled from 'styled-components';
import { width, maxWidth, height, space, textAlign } from 'styled-system';

const Box = styled.div`
  box-sizing: border-box;
  ${width};
  ${maxWidth};
  ${height};
  ${space};
  ${textAlign};
`;

export default Box;
