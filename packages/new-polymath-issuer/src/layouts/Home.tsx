import React, { FC, Fragment } from 'react';
import { Link } from 'redux-little-router';
import { Footer, StickyTop } from '@polymathnetwork/new-ui';
import { Header } from '~/components';

export const HomeLayout: FC = ({ children }) => (
  <Fragment>
    <StickyTop zIndex={'header'}>
      <Header RouterLink={Link} variant="transparent" />
    </StickyTop>
    {children}
    <Footer variant="transparent" />
  </Fragment>
);
