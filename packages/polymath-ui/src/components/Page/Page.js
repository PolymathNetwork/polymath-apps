// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
import DocumentTitle from 'react-document-title';

import Box from '../Box';

const StyledBox = styled(Box)`
  min-height: calc(100vh - ${({ theme }) => theme.navbar.height} * 2);
`;

const Page = ({ children, title = 'Polymath', ...props }) => (
  <StyledBox mx="5%" {...props}>
    <DocumentTitle title={title}>
      <Fragment>{children}</Fragment>
    </DocumentTitle>
  </StyledBox>
);

export default Page;
