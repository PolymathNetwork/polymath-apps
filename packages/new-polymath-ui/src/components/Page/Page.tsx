import React, { Fragment, FC } from 'react';
import styled, { StyledProps } from 'styled-components';
import DocumentTitle from 'react-document-title';
import { PageWrap } from '../PageWrap';

export interface Props extends StyledProps<any> {
  title: string;
  // TODO @RafaelVidaurre: I'd use an enum type here with the global size types
  py: string;
}

const Container = styled(PageWrap)`
  min-height: calc(
    100vh -
      (${({ theme }) => `${theme.header.height} + ${theme.footer.height}`})
  );
`;

export const Page: FC<Props> = ({ children, title = 'Polymath', ...props }) => (
  <Container {...props}>
    <DocumentTitle title={title}>
      <Fragment>{children}</Fragment>
    </DocumentTitle>
  </Container>
);

Page.defaultProps = {
  py: 'xl',
};
