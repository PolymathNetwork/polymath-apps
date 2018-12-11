import React from 'react';
import { navigate } from '@reach/router';
import 'jest-dom/extend-expect';
import { cleanup } from 'react-testing-library';
import { Routes } from '~/App/Routes';
import { render } from '~/testUtils/helpers';

jest.mock('@reach/router', () => {
  const original = require.requireActual('@reach/router');
  return {
    ...original,
    navigate: jest.fn((...args) => original.navigate(...args)),
  };
});

describe('Routes', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Component', () => {});

  describe('Access control', () => {
    describe('State: Anonymous', () => {
      describe('Route: /', () => {
        beforeEach(() => {
          navigate('/');
        });

        test('renders the home page', () => {
          render(<Routes />).getByTestId('HomePage');
        });
      });

      describe('Route: /login', () => {
        beforeEach(() => {
          navigate('/login');
        });

        test('renders the login page', () => {
          render(<Routes />).getByTestId('LoginPage');
        });
      });

      describe('Route: *', () => {
        beforeEach(() => {
          navigate('/some-route-that-doesnt-exist');
        });

        test('redirects to "/"', async () => {
          render(<Routes />);
          expect(navigate).toBeCalledWith('/');
        });
      });
    });
  });
});
