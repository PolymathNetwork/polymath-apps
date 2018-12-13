import React, { FC } from 'react';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import {
  HomePage,
  LoginPage,
  RedirectionPage,
  SecurityTokensIndexPage,
  SecurityTokensReservePage,
  SecurityTokensDividendsPage,
} from '~/pages';
import { DashboardLayout } from '~/layouts';

// const RoutesGroup: FC<RouteComponentProps> = ({ children }) => (
//   <React.Fragment>{children}</React.Fragment>
// );

export const Routes = () => (
  <Router>
    <LoginPage path="/login" />

    <HomePage path="/" />

    <DashboardLayout path="/dashboard">
      <SecurityTokensIndexPage path="/" />
    </DashboardLayout>

    <DashboardLayout path="/securityTokens">
      <SecurityTokensReservePage path="reserve" />
      <SecurityTokensDividendsPage path=":symbol/dividends" />
      <RedirectionPage path="/" to="/" />
      <RedirectionPage default to="/dashboard" />
    </DashboardLayout>

    <RedirectionPage default to="/" />
  </Router>
);
