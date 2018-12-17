import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '~/state/store';
import { Pages } from '~/pages';

export const App = () => (
  <Provider store={store}>
    <Pages />
  </Provider>
);
