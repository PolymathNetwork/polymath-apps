import React, { Fragment } from 'react';
// import createSagaMiddleware from 'redux-saga';
import { render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Action, Middleware } from 'redux';
import { set } from 'lodash';
import Web3FakeProvider from 'web3-fake-provider';
import { RootState } from '~/state/reducers/root';

interface RenderTestOpts {
  initialState: RootState;
}

const middlewares: Middleware[] = [];
const mockStore = configureMockStore(middlewares);

const customRender = (
  node: React.ReactElement<any>,
  testOpts: RenderTestOpts,
  ...opts: any[]
) => {
  const initialState = testOpts.initialState;
  const { rerender, ...result } = render(
    <Provider store={mockStore(initialState)}>{node}</Provider>,
    ...opts
  );

  const customRerender = (rerenderNode: React.ReactElement<any>) => {
    return rerender(<Fragment>{rerenderNode}</Fragment>);
  };

  return { rerender: customRerender, ...result };
};

export * from 'react-testing-library';
export { customRender as render };

export class MockedStore {
  public state: RootState;
  public dispatched: Action[] = [];

  constructor() {
    const { reducer: rootReducer } = require('~/state/reducers/root');
    this.state = rootReducer(undefined, {} as any);
    this.dispatched = [];
  }

  public dispatch = (action: Action) => {
    const { reducer: rootReducer } = require('~/state/reducers/root');
    this.state = rootReducer(this.getState(), action);
    this.dispatched.push(action);
  };

  public getState = () => {
    return { ...this.state };
  };

  public setState = (path: string, value: any) => {
    const newState = {
      ...this.state,
    };
    set(newState, path, value);
    this.state = newState;
  };
}

export class MockEthereumProvider extends Web3FakeProvider {
  public networkVersion = '15';
  public async enable() {}
}

export function getGeneratorOutputs(gen: IterableIterator<any>) {
  const results = [];
  let next = gen.next();
  while (!next.done) {
    results.push(next.value);
    next = gen.next();
  }
  return results;
}

export function mockEthereumBrowser() {
  const ethereum = new MockEthereumProvider();
  (global as any).ethereum = ethereum;
}
