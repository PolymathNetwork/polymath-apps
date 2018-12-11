import React, { Component, Fragment, FC } from 'react';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import { HomePage, LoginPage, RedirectionPage } from '~/pages';

export const Routes = () => (
  <Router>
    <HomePage path="/" />
    <LoginPage path="/login" />
    <RedirectionPage default />
  </Router>
);
