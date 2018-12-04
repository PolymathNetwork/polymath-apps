import React from 'react';
import styled from 'styled-components';

import Box from '../Box';

const Container = styled(Box)`
  overflow-y: auto;
`;

const Body = props => {
  return <Container>{props.children}</Container>;
};

export default Body;
