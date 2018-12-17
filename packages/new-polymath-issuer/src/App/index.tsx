import * as React from 'react';
import { Provider } from 'react-redux';
import { getStore } from '~/state/store';
import { Pages } from '~/pages';

export const App = () => (
  <Provider store={getStore()}>
    <Pages />
  </Provider>
);
