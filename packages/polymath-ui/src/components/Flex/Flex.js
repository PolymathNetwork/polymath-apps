// @flow

import styled from 'styled-components';
import { alignItems, justifyContent, flex, flexWrap } from 'styled-system';

import Box from '../Box';

const Flex = styled(Box)`
  display: flex;

  ${flex};
  ${flexWrap};
  ${alignItems};
  ${justifyContent};
`;

Flex.defaultProps = {
  alignItems: 'center',
  flexWrap: 'wrap',
};

export default Flex;
