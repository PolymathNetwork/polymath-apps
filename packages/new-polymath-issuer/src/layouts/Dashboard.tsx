import React, { FC } from 'react';
import { Link } from 'redux-little-router';
import {
  Footer,
  StickyTop,
  Sidebar,
  Icon,
  icons,
  Grid,
} from '@polymathnetwork/new-ui';
import { Header } from '~/components';

export const DashboardLayout: FC = ({ children }) => (
  <Grid gridGap={0} gridAutoColumns="auto 1fr" gridAutoFlow="column">
    <Sidebar>
      <Sidebar.Item as={Link} href="providers">
        <Icon Asset={icons.SvgAccount} />
        Providers
      </Sidebar.Item>
    </Sidebar>
    <div>
      <StickyTop zIndex={'header'}>
        <Header RouterLink={Link} />
      </StickyTop>
      {children}
      <Footer />
    </div>
  </Grid>
);
