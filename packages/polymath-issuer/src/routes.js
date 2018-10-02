// @flow
import { NotFoundPage } from '@polymathnetwork/ui';

import App from './components/App';
import Dashboard from './components/Dashboard';

import WhitelistPage from './pages/compliance/CompliancePage';
import TickerPage from './pages/ticker/TickerPage';
import ProvidersPage from './pages/providers/ProvidersPage';
import TokenPage from './pages/token/TokenPage';
import STOPage from './pages/sto/STOPage';

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
            component: NotFoundPage,
          },
        ],
      },
      {
        component: NotFoundPage,
      },
    ],
  },
];
