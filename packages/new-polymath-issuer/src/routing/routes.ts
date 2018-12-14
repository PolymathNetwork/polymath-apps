import {
  LoginPage,
  MetamaskLockedPage,
  MetamaskGetPage,
  SecurityTokensDividendsPage,
  SecurityTokensIndexPage,
  HomePage,
} from '~/pages';

import { handleDashboardRoute, handleLoginRoute } from '~/state/sagas/router';

export const routes = {
  '/': {
    Page: HomePage,
  },
  '/dashboard': {
    Page: SecurityTokensIndexPage,
    handler: handleDashboardRoute,
  },
  '/login': {
    Page: LoginPage,
    handler: handleLoginRoute,
  },
  '/securityTokens': {
    '/': {
      Page: SecurityTokensIndexPage,
    },
    '/:symbol': {
      '/dividends': {
        Page: SecurityTokensDividendsPage,
      },
    },
  },
  '/metamask': {
    '/locked': {
      Page: MetamaskLockedPage,
    },
    '/get': {
      Page: MetamaskGetPage,
    },
  },
};
