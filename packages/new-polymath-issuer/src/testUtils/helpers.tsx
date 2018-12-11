import React, { Fragment } from 'react';
import { render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';

const middlewares: any[] = [];

const customRender = (node: React.ReactElement<any>, ...opts: any[]) => {
  const { rerender, ...result } = render(<Fragment>{node}</Fragment>, ...opts);

  const customRerender = (rerenderNode: React.ReactElement<any>) => {
    return rerender(<Fragment>{rerenderNode}</Fragment>);
  };

  return { rerender: customRerender, ...result };
};

export const mockStore = configureMockStore(middlewares);
export * from 'react-testing-library';
export { customRender as render };
