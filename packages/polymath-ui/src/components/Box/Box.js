import styled from 'styled-components';
import { size, space, textAlign } from 'styled-system';

const Box = styled.div`
  margin: unset;
  padding: unset;
  border: unset;
  background: unset;
  font: unset;
  font-family: inherit;
  font-size: 100%;
  box-sizing: border-box;
  ${size};
  ${space};
  ${textAlign};
`;

export default Box;
