// @flow

import React from 'react';
import styled from 'styled-components';

import Page from '../Page';

const StyledPage = styled(Page)`
  margin-left: calc(5% + ${({ theme }) => theme.sidebar.width});
`;

const PageDashboard = ({ children, ...props }) => (
  <StyledPage p={2} {...props}>
    {children}
  </StyledPage>
);

export default PageDashboard;
