import React, { FC, Fragment } from 'react';
import { Link } from 'redux-little-router';
import { Footer, StickyTop } from '@polymathnetwork/new-ui';
import { Header } from '~/components';

export const DefaultLayout: FC = ({ children }) => (
  <Fragment>
    <StickyTop zIndex={'header'}>
      <Header RouterLink={Link} />
    </StickyTop>
    {children}
    <Footer />
  </Fragment>
);
