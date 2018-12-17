import { reducer } from '../entities';

describe('Reducer: entities', () => {
  test('initialState', () => {
    expect(reducer(undefined, {} as any)).toMatchSnapshot();
  });
});
