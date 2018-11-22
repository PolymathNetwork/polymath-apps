import React from 'react';
import { render } from 'react-testing-library';
import { ThemeProvider } from 'styled-components';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import theme from '../src/theme';

const middlewares = [thunk];

const customRender = (node, ...opts) => {
  const { rerender, ...result } = render(
    <ThemeProvider theme={theme}>{node}</ThemeProvider>,
    ...opts
  );

  const customRerender = (rerenderNode, ...rerenderOpts) => {
    return rerender(
      <ThemeProvider theme={theme}>{rerenderNode}</ThemeProvider>,
      ...rerenderOpts
    );
  };

  return { rerender: customRerender, ...result };
};

export const mockStore = configureMockStore(middlewares);
export * from 'react-testing-library';
export { customRender as render };
