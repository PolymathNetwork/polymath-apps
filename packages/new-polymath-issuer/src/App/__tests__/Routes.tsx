import React from 'react';
import * as reachRouter from '@reach/router';
import 'jest-dom/extend-expect';
import { cleanup } from 'react-testing-library';
import { utils } from '@polymathnetwork/new-shared';
import { Routes } from '~/App/Routes';
import { render } from '~/testUtils/helpers';

describe('Routes', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Component', () => {});

  describe('Access control', () => {
    describe('State: Anonymous', () => {
      describe('Route: /', () => {
        beforeEach(() => {
          reachRouter.navigate('/');
        });

        test('renders the home page', () => {
          render(<Routes />).getByTestId('HomePage');
        });
      });

      describe('Route: /login', () => {
        beforeEach(() => {
          reachRouter.navigate('/login');
        });

        test('renders the login page', () => {
          render(<Routes />);
        });
      });

      describe('Route: *', () => {
        beforeEach(() => {
          reachRouter.navigate('/some-route-that-doesnt-exist');
        });

        test('redirects to "/"', async () => {
          const spy = spyOn(reachRouter, 'navigate');
          render(<Routes />);
          expect(spy).toHaveBeenCalledWith('/');
        });
      });
    });
  });
});
