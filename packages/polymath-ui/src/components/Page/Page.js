// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
import DocumentTitle from 'react-document-title';

import PageWrap from '../PageWrap';

const Container = styled(PageWrap)`
  min-height: calc(
    100vh -
      (${({ theme }) => `${theme.header.height} + ${theme.footer.height}`})
  );
`;

const Page = ({ children, title = 'Polymath', ...props }) => (
  <Container {...props}>
    <DocumentTitle title={title}>
      <Fragment>{children}</Fragment>
    </DocumentTitle>
  </Container>
);

export default Page;

Page.defaultProps = {
  py: 'xl',
};
