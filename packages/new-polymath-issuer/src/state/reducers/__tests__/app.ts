import { reducer } from '../app';
import * as actions from '~/state/actions/app';

describe('Reducer: app', () => {
  test('initialState', () => {
    expect(reducer(undefined, {} as any)).toMatchSnapshot();
  });

  test('setActiveSequence sets activeSequence', () => {
    const id = 'someId';
    const result = reducer(undefined, actions.setActiveSequence(id));
    expect(result.activeSequence).toEqual(id);
  });

  test('initializePolyClient actions correctly update state', () => {
    const startResult = reducer(undefined, actions.initializePolyClientStart());
    const successResult = reducer(
      startResult,
      actions.initializePolyClientSuccess()
    );
    const failResult = reducer(
      startResult,
      actions.initializePolyClientFailure(new Error('Some error'))
    );
    // Not yet finished initializing
    expect(startResult.polyClientInitialized).toEqual(false);
    expect(successResult.polyClientInitialized).toEqual(true);
    expect(failResult.polyClientInitialized).toEqual(false);
  });

  test('setChangingRoute sets changingRoute correctly ', () => {
    let result = reducer(undefined, actions.setChangingRoute(true));
    expect(result.changingRoute).toEqual(true);
    result = reducer(undefined, actions.setChangingRoute(false));
    expect(result.changingRoute).toEqual(false);
  });
});
