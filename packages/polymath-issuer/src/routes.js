// @flow
import React from 'react';
import { NotFoundPage, MaintenancePage } from '@polymathnetwork/ui';
import { Redirect } from 'react-router-dom';

import App from './components/App';
import Dashboard from './components/Dashboard';

import WhitelistPage from './pages/compliance/CompliancePage';
import TickerPage from './pages/ticker/TickerPage';
import ProvidersPage from './pages/providers/ProvidersPage';
import TokenPage from './pages/token/TokenPage';
import STOPage from './pages/sto/STOPage';
import DividendsPage from './pages/dividends/DividendsPage';
import DividendsWizardPage from './pages/dividends/DividendsWizardPage';

export default [
  {
    component: App,
    routes: [
      {
        path: '/ticker',
        component: TickerPage,
        exact: true,
      },
      {
        path: '/dashboard/:id',
        component: Dashboard,
        routes: [
          {
            path: '/dashboard/:id/providers',
            component: ProvidersPage,
            exact: true,
          },
          {
            path: '/dashboard/:id',
            component: TokenPage,
            exact: true,
          },
          {
            path: '/dashboard/:id/sto',
            component: STOPage,
            exact: true,
          },
          {
            path: '/dashboard/:id/compliance',
            component: WhitelistPage,
            exact: true,
          },
          {
            path: '/dashboard/:id/dividends',
            component: DividendsPage,
            exact: true,
          },
          {
            path: '/dashboard/:id/checkpoints/:checkpointIndex/dividends/new',
            component: DividendsWizardPage,
            exact: true,
          },
          {
            component: NotFoundPage,
          },
        ],
      },
      {
        path: '/securityTokens/:id/checkpoints/:checkpointIndex/dividends/new',
        component: props => {
          const { id, checkpointIndex } = props.match.params;
          return (
            <Redirect
              to={`/dashboard/${id}/checkpoints/${checkpointIndex}/dividends/new`}
            />
          );
        },
        exact: true,
      },
      {
        path: '/maintenance',
        component: MaintenancePage,
        exact: true,
      },
      {
        component: NotFoundPage,
      },
    ],
  },
];
