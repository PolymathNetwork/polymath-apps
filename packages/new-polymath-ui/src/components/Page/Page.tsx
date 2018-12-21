import React, { Fragment, FC } from 'react';
import DocumentTitle from 'react-document-title';

import * as S from './styles';
import { PageWrapProps } from '../PageWrap';

export interface PageProps extends PageWrapProps {
  title: string;
  children: React.ComponentType;
}

export const Page: FC<PageProps> = ({
  children,
  title = 'Polymath',
  ...props
}) => (
  <S.Wrapper py="xl" {...props}>
    <DocumentTitle title={title}>
      <Fragment>{children}</Fragment>
    </DocumentTitle>
  </S.Wrapper>
);