import React from 'react';
import { Router } from '@reach/router';
import { HomePage, LoginPage, RedirectionPage } from '~/pages';

/**
 * -
 */

export const Routes = () => (
  <Router>
    <HomePage path="/" />
    <LoginPage path="/login" />
    <SignupPage path="/signup" />
    <ConfirmationPage path="/confirmEmail" />
    <DashboardPage path="/dashboard" />

    <SecurityTokens>
      <SecurityTokensIndex path="/securityTokens" />
      <SecurityTokensReserve path="/securityTokens/reserve" />
      <SecurityTokensShow path="/securityToken/:symbol" />
      <SecurityTokensCreate path="/securityToken/:symbol/create" />
      <SecurityTokensMinting path="/securityToken/:symbol/minting" />
      <SecurityTokensMinting path="/securityToken/:symbol/minting" />
      <SecurityTokensWhitelist path="/securityToken/:symbol/whitelist" />
      <SecurityTokensProviders path="/securityToken/:symbol/providers" />
      <StoTemplates path="/securityToken/:symbol/stoTemplates" />
      <StoCreate path="/securityToken/:symbol/sto/create" />{' '}
      {/* Requires template as temp string */}
      <StoShow path="/securityToken/:symbol/sto" />
    </SecurityTokens>

    <RedirectionPage default to="/" />
  </Router>
);
