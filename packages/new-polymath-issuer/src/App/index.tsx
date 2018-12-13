import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '~/state/store';

export const App = () => (
  <Provider store={store}>
    <div>Ohai</div>
  </Provider>
);
