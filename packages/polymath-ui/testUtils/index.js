import React from 'react';
import { render } from 'react-testing-library';
import { ThemeProvider } from 'styled-components';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import theme from '../src/theme';

const middlewares = [thunk];

const customRender = (node, ...opts) => {
  return render(<ThemeProvider theme={theme}>{node}</ThemeProvider>);
};

export const mockStore = configureMockStore(middlewares);
export * from 'react-testing-library';
export { customRender as render };
