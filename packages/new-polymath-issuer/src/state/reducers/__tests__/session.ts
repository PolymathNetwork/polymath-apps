import { reducer } from '../session';
import * as actions from '~/state/actions/session';
import { Identity } from '~/types';

describe('Reducer: session', () => {
  test('initialState', () => {
    expect(reducer(undefined, {} as any)).toMatchSnapshot();
  });

  test('setIdentity updates identity ', () => {
    const identity: Identity = {
      email: 'some@email',
      fullName: 'Rafael Vidaurre',
    };
    const result = reducer(undefined, actions.setIdentity(identity));
    expect(result.identity).toEqual(identity);
  });

  test("setWallet updates the session's wallet ", () => {
    const wallet = {
      address: '0x1234',
    };
    const result = reducer(undefined, actions.setWallet(wallet));
    expect(result.wallet).toEqual(wallet);
  });
});
