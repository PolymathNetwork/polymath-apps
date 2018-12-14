import {
  LoginPage,
  MetamaskLockedPage,
  MetamaskGetPage,
  SecurityTokensDividendsPage,
  SecurityTokensIndexPage,
  HomePage,
} from '~/pages';

export const routes = {
  '/': {
    Page: HomePage,
  },
  '/dashboard': {
    Page: SecurityTokensIndexPage,
  },
  '/login': {
    Page: LoginPage,
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
