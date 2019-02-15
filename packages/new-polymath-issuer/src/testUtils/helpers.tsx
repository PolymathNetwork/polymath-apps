import React, { Fragment } from 'react';
// import createSagaMiddleware from 'redux-saga';
import { render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { compose, applyMiddleware, Action, Middleware } from 'redux';
import { set } from 'lodash';
import Web3FakeProvider from 'web3-fake-provider';
import { RootState, reducer } from '~/state/reducers/root';
// import { routerEnhancer, routerMiddleware } from '~/routing';
// import { rootSaga } from '~/state/sagas/root';

interface RenderTestOpts {
  initialState: RootState;
}
// export const sagaMiddleware = createSagaMiddleware();
// sagaMiddleware.run(rootSaga);
// const middlewares: Middleware[] = [sagaMiddleware, routerMiddleware];
// // const enhancer = compose(
// //   routerEnhancer,
// //   applyMiddleware(...middlewares)
// // );
const middlewares: Middleware[] = [];
const mockStore = configureMockStore(middlewares);

const defaultState = reducer({} as any, {} as any);

const customRender = (
  node: React.ReactElement<any>,
  testOpts: RenderTestOpts,
  ...opts: any[]
) => {
  const initialState = testOpts.initialState || defaultState;
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
