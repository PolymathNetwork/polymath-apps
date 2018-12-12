import React, { ComponentType, Fragment } from 'react';
import styled from 'styled-components';
import DocumentTitle from 'react-document-title';

import { PageWrap } from '../PageWrap';

export interface PageProps {
  title: string;
  children: ComponentType;
}

const Container = styled(PageWrap)`
  min-height: calc(
    100vh -
      (${({ theme }) => `${theme.header.height} + ${theme.footer.height}`})
  );
`;

export const Page = ({ children, title = 'Polymath', ...props }: PageProps) => (
  <Container {...props}>
    <DocumentTitle title={title}>
      <Fragment>{children}</Fragment>
    </DocumentTitle>
  </Container>
);

Page.defaultProps = {
  py: 'xl',
};
