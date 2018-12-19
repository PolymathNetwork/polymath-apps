import React, { Fragment } from 'react';
import { render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import { set } from 'lodash';
import Web3FakeProvider from 'web3-fake-provider';
import { RootState, rootReducer } from '~/state/store';

const middlewares: any[] = [];

export const mockStore = configureMockStore(middlewares);

const customRender = (node: React.ReactElement<any>, ...opts: any[]) => {
  const { rerender, ...result } = render(
    <Provider store={mockStore()}>{node}</Provider>,
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
    this.state = rootReducer(undefined, {} as any);
    this.dispatched = [];
  }

  public dispatch = (action: Action) => {
    this.state = rootReducer(this.getState(), action);
    this.dispatched.push(action);
  };

  public getState = () => {
    // console.log('calling get state', this.state.session);
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
