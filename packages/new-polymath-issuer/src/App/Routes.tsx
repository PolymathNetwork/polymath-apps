import React from 'react';
import { Router } from '@reach/router';
import { HomePage, LoginPage, RedirectionPage } from '~/pages';
import { polyClient } from '~/lib/polyClient';

/**
 * -
 */

export const Routes = () => (
  <Router>
    <HomePage path="/" />
    <LoginPage path="/login" />

    <RedirectionPage default to="/" />
  </Router>
);
