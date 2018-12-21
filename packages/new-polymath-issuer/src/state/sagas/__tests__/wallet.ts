import { browserUtils } from '@polymathnetwork/sdk';
import { MockedStore } from '~/testUtils/helpers';

// TODO @RafaelVidaurre: Finish these tests

jest.mock('@polymathnetwork/sdk', () => {
  const original = require.requireActual('@polymathnetwork/sdk');
  return {
    ...original,
    browserUtils: {
      onAddressChange: jest.fn().mockImplementation(() => {
        return () => {};
      }),
      getNetworkId: jest.fn(),
    },
  };
});

describe('wallet sagas', () => {
  // let store;
  // beforeEach(() => {
  //   store = new MockedStore();
  // });
  // describe('on address changes', () => {
  //   test.skip('calls setWallet action when wallet address is changed', () => {
  //     (browserUtils.onAddressChange as any).mockImplementation(() => {});
  //   });
  // });
});
