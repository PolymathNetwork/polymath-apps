import { runSaga } from 'redux-saga';
import { PolymathError, browserUtils, ErrorCodes } from '@polymathnetwork/sdk';
import '~/state/store';
import * as sagas from '~/state/sagas/accessControl';
import { MockedStore, mockEthereumBrowser } from '~/testUtils/helpers';

jest.mock('~/lib/polyClient', () => ({
  polyClient: {
    connect: () => {},
  },
}));

jest.mock('@polymathnetwork/sdk', () => {
  const original = require.requireActual('@polymathnetwork/sdk');
  return {
    ...original,
    browserUtils: {
      getCurrentAddress: jest.fn(() => {
        console.log(' ===== MOCK CALLED =====');
      }),
      onAddressChange() {
        return () => {};
      },
      enableWallet: jest.fn(),
      getNetworkId: jest.fn(async () => '1'),
    },
  };
});

describe('accessControl sagas', () => {
  let store: MockedStore;

  beforeEach(() => {
    store = new MockedStore();
    mockEthereumBrowser();
  });

  describe('requireWallet', () => {
    test.only('redirects to "/login" if user denied access', async () => {
      (browserUtils.getCurrentAddress as any).mockImplementationOnce(() => {
        console.log('BROWTILSS');
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
      (browserUtils.getCurrentAddress as any).mockImplementationOnce(() => {
        throw new PolymathError({ code: ErrorCodes.IncompatibleBrowser });
      });

      await runSaga(store, sagas.requireWallet);

      expect(store.dispatched).toContainEqual({
        type: 'ROUTER_PUSH',
        payload: expect.objectContaining({ pathname: '/metamask/get' }),
      });
    });

    test('redirects to "/metamask/locked" if metamask is locked', async () => {
      (browserUtils.getCurrentAddress as any).mockImplementationOnce(() => {
        throw new PolymathError({ code: ErrorCodes.WalletIsLocked });
      });

      await runSaga(store, sagas.requireWallet).done;

      expect(store.dispatched).toContainEqual({
        type: 'ROUTER_PUSH',
        payload: expect.objectContaining({ pathname: '/metamask/locked' }),
      });
    });
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

      (browserUtils.getCurrentAddress as any).mockImplementationOnce(() => {
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
