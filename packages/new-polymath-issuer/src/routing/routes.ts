// tslint:disable object-literal-key-quotes
import {
  LoginPage,
  MetamaskLockedPage,
  MetamaskGetPage,
  SecurityTokensDividendsPage,
  SecurityTokensIndexPage,
  HomePage,
  NotFoundPage,
  TempPage,
} from '~/pages';

import {
  handleDashboardRoute,
  handleLoginRoute,
  handleSecurityTokensRoute,
  handleDividendsRoute,
} from '~/state/sagas/router';
import { DashboardLayout, HomeLayout } from '~/layouts';

export const routes = {
  '/': {
    Page: HomePage,
    Layout: HomeLayout,
    '/dashboard': {
      Page: SecurityTokensIndexPage,
      Layout: DashboardLayout,
      handler: handleDashboardRoute,
    },
    '/login': {
      Page: LoginPage,
      handler: handleLoginRoute,
    },
    '/securityTokens': {
      Layout: DashboardLayout,
      Page: SecurityTokensIndexPage,
      '/:securityTokenSymbol': {
        '/dividends': {
          Page: SecurityTokensDividendsPage,
          handler: handleDividendsRoute,
        },
      },
      handler: handleSecurityTokensRoute,
    },
    '/metamask': {
      '/locked': {
        Page: MetamaskLockedPage,
      },
      '/get': {
        Page: MetamaskGetPage,
      },
    },
    '/notFound': {
      Page: NotFoundPage,
    },
    // NOTE @RafaelVidaurre: Temporary route for testing the low-level package
    // on Polymath SDK
    '/temp': {
      Page: TempPage,
    },
  },
};
