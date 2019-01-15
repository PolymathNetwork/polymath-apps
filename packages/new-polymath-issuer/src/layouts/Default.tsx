import React, { FC, Fragment } from 'react';
import { Link } from 'redux-little-router';
import { Header, Footer, StickyTop } from '@polymathnetwork/new-ui';

export const DefaultLayout: FC = ({ children }) => (
  <Fragment>
    <StickyTop zIndex={'header'}>
      <Header RouterLink={Link} variant="transparent" />
    </StickyTop>
    {children}
    <Footer variant="transparent" />
  </Fragment>
);
