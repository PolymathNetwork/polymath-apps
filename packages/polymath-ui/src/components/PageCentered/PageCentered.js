// @flow

import React from 'react';
import styled from 'styled-components';

import Page from '../Page';
import Flex from '../Flex';

const StyledPage = styled(Page)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageCentered = ({ children, ...props }) => (
  <StyledPage p={[1, 2]} {...props}>
    {children}
  </StyledPage>
);

export default PageCentered;
