// @flow

import styled from 'styled-components';
import { maxWidth, height, space, textAlign } from 'styled-system';

const Box = styled.div`
  box-sizing: border-box;
  ${maxWidth};
  ${height};
  ${space};
  ${textAlign};
`;

export default Box;
