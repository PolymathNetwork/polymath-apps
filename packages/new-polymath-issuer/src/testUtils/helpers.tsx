import React, { Fragment } from 'react';
import { render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { RootState, rootReducer } from '~/state/store';
import { Action } from 'redux';

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
    this.state = rootReducer(this.state, action);
    this.dispatched.push(action);
  };

  public getState = () => {
    return this.state;
  };

  public setState = (state: any) => {
    this.state = {
      ...this.state,
      ...state,
    };
  };
}
