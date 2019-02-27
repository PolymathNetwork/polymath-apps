// tslint:disable object-literal-key-quotes
import {
  LoginPage,
  MetamaskLockedPage,
  MetamaskGetPage,
  SecurityTokensDividendsPage,
  DividendsWizardPage,
  SecurityTokensIndexPage,
  HomePage,
  NotFoundPage,
  DividendsDetails,
} from '~/pages';

import {
  handleDashboardRoute,
  handleLoginRoute,
  handleSecurityTokensRoute,
  handleDividendsRoute,
  handleDividendsWizardRoute,
} from '~/state/sagas/router';
import { DashboardLayout, HomeLayout } from '~/layouts';
import { DividendsWizardPage } from '~/pages/DividendsWizard';

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
          '/:dividendIndex': {
            // TODO @monitz87: add Dividend Card page and handler when they are done
          },
          Page: SecurityTokensDividendsPage,
          handler: handleDividendsRoute,
          '/new': {
            Page: DividendsWizardPage,
            handler: handleDividendsRoute,
          },
          '/details': {
            Page: DividendsDetails,
          },
        },
        '/checkpoints/:checkpointIndex/dividends/new': {
          Page: DividendsWizardPage,
          handler: handleDividendsWizardRoute,
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
