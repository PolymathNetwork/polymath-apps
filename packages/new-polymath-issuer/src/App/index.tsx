import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '~/state/store';
import { Routes } from '~/App/Routes';

export const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);
