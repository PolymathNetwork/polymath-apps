// tslint:disable object-literal-key-quotes
import {
  LoginPage,
  MetamaskLockedPage,
  MetamaskGetPage,
  SecurityTokensDividendsPage,
  DividendsWizardPage,
  DividendDetailsPage,
  SecurityTokensIndexPage,
  HomePage,
  NotFoundPage,
} from '~/pages';

import {
  handleDashboardRoute,
  handleLoginRoute,
  handleSecurityTokensRoute,
  handleDividendsRoute,
  handleDividendsWizardRoute,
  handleDividendDetailsRoute,
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
        '/checkpoints/:checkpointIndex/dividends': {
          '/new': {
            Page: DividendsWizardPage,
            handler: handleDividendsWizardRoute,
          },
          '/:dividendIndex': {
            Page: DividendDetailsPage,
            handler: handleDividendDetailsRoute,
          },
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
  },
};
