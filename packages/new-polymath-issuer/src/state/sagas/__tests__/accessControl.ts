import { runSaga } from 'redux-saga';
import {
  PolymathError,
  getBrowserSupport,
  BrowserSupport,
  getCurrentAddress,
  ErrorCodes,
} from '@polymathnetwork/sdk';
import * as sagas from '~/state/sagas/accessControl';
import { MockedStore, MockEthereumProvider } from '~/testUtils/helpers';

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
    getCurrentAddress: jest.fn(),

    enableWallet: jest.fn(),
  };
});

describe('accessControl sagas', () => {
  let store: MockedStore;

  beforeEach(() => {
    store = new MockedStore();
    const ethereum = new MockEthereumProvider();
    (global as any).window.ethereum = ethereum;
  });

  describe('requireWallet', () => {
    test('redirects to "/login" if user denied access', async () => {
      (getCurrentAddress as any).mockImplementationOnce(() => {
        throw new PolymathError({ code: ErrorCodes.UserDeniedAccess });
      });

      store.setState('session.wallet', undefined);
      await runSaga(store, sagas.requireWallet);

      expect(store.dispatched).toContainEqual({
        type: 'ROUTER_PUSH',
        payload: expect.objectContaining({ pathname: '/login' }),
      });
    });

    test('does not redirect if redirect option is false', async () => {
      store.setState('session.wallet', undefined);
      await runSaga(store, sagas.requireWallet, { redirect: false });

      expect(store.dispatched).not.toContainEqual({
        type: 'ROUTER_PUSH',
        payload: expect.objectContaining({ pathname: '/login' }),
      });
    });

    test('redirects to "/metamask/get" if browser is incompatible with Ethereum', async () => {
      (getCurrentAddress as any).mockImplementationOnce(() => {
        throw new PolymathError({ code: ErrorCodes.IncompatibleBrowser });
      });

      await runSaga(store, sagas.requireWallet);

      expect(store.dispatched).toContainEqual({
        type: 'ROUTER_PUSH',
        payload: expect.objectContaining({ pathname: '/metamask/get' }),
      });
    });

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
      store.setState('session.wallet', undefined);

      (getCurrentAddress as any).mockImplementationOnce(() => {
        return undefined;
      });

      await runSaga(store, sagas.requireAnonymous);

      expect(store.dispatched).not.toContainEqual({
        type: 'ROUTER_PUSH',
        payload: expect.anything(),
      });
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
