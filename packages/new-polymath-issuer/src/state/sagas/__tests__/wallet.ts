import { onAddressChange } from '@polymathnetwork/sdk';
import { MockedStore } from '~/testUtils/helpers';

// TODO @RafaelVidaurre: Finish these tests

jest.mock('@polymathnetwork/sdk', () => {
  const original = require.requireActual('@polymathnetwork/sdk');
  return {
    ...original,
    onAddressChange: jest.fn().mockImplementation(() => {
      return () => {};
    }),
    getNetworkId: jest.fn(),
  };
});

describe('wallet sagas', () => {
  let store;

  beforeEach(() => {
    store = new MockedStore();
  });

  describe('on address changes', () => {
    test.skip('calls setWallet action when wallet address is changed', () => {
      (onAddressChange as any).mockImplementation(() => {});
    });
  });
});
