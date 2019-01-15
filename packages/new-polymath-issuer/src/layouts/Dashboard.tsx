import React, { FC, Fragment } from 'react';
import { Link as RouterLink } from 'redux-little-router';
import {
  Header,
  Footer,
  StickyTop,
  Sidebar,
  Icon,
  Link,
  icons,
} from '@polymathnetwork/new-ui';

export const DashboardLayout: FC = ({ children }) => (
  <Fragment>
    <StickyTop zIndex={'header'}>
      <Header RouterLink={Link} variant="transparent" />
    </StickyTop>
    <Sidebar>
      <Sidebar.Item as={RouterLink} href="providers">
        <Icon Asset={icons.SvgAccount} />
        Providers
      </Sidebar.Item>
    </Sidebar>
    {children}
    <Footer variant="transparent" />
  </Fragment>
);
