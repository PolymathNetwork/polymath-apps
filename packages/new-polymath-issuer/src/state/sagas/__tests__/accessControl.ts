import { runSaga } from 'redux-saga';
import * as sagas from '~/state/sagas/accessControl';
import { MockedStore } from '~/testUtils/helpers';
import { RootState } from '~/state/store';

jest.mock('~/lib/polyClient', () => ({
  polyClient: {
    initialize: () => {},
  },
}));

jest.mock('@polymathnetwork/sdk', () => {
  const original = require.requireActual('@polymathnetwork/sdk');
  return {
    ...original,
    onAddressChange() {
      return () => {};
    },
  };
});

describe('accessControl sagas', () => {
  let store: MockedStore;

  beforeEach(() => {
    store = new MockedStore();
  });

  describe('requireWallet', () => {
    test('redirects to "/login" if user denied access', () => {});

    test.skip('redirects to "/metamask/get" if browser is incompatible with Ethereum', () => {});

    test.skip('redirects to "/metamask/locked" if metamask is locked', () => {});
  });

  describe('requireAnonymous', () => {
    test('redirects to "/" if wallet already exists', async () => {
      store.setState('session.wallet', { address: '0x1234' });

      await runSaga(store, sagas.requireAnonymous);

      expect(
        store.dispatched.find(({ type }) => type === 'ROUTER_PUSH')
      ).toHaveProperty('payload.pathname', '/');
    });

    test('does not redirect if anonymous', async () => {
      await runSaga(store, sagas.requireAnonymous);

      expect(
        store.dispatched.find(({ type }) => type === 'ROUTER_PUSH')
      ).toBeUndefined();
    });
  });

  describe('requireAppConnected', () => {
    test('ensures the polyClient is initialized', async () => {
      await runSaga(store, sagas.requireAppConnected);
      const state = store.getState();
      expect(state.app.polyClientInitialized).toEqual(true);
    });
  });
});
