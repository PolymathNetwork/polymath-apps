import React from 'react';
import { Router } from '@reach/router';
import { HomePage, LoginPage, RedirectionPage } from '~/pages';

export const Routes = () => (
  <Router>
    <HomePage path="/" />
    <LoginPage path="/login" />
    <RedirectionPage default to="/" />
  </Router>
);
