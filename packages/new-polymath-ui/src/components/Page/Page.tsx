import React, { Fragment, FC } from 'react';
import DocumentTitle from 'react-document-title';
import { StyledProps } from 'styled-components';

import * as sc from './styles';
import { PageWrapProps } from '../PageWrap';

export interface PageProps extends PageWrapProps {
  title: string;
  children: React.ComponentType;
}

export const Page: FC<PageProps & StyledProps<any>> = ({
  children,
  title = 'Polymath',
  ...props
}) => (
  <sc.Wrapper py="xl" {...props}>
    <DocumentTitle title={title}>
      <Fragment>{children}</Fragment>
    </DocumentTitle>
  </sc.Wrapper>
);
