import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '~/state/store';
import { Routes } from '~/App/Routes';
import { polyClient } from '~/lib/polyClient';

console.log(polyClient.currentWallet);

export const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);
