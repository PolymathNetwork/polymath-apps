import { mockEthereumBrowser } from '~/testUtils/helpers';

// TODO @RafaelVidaurre: Finish these tests
describe('wallet sagas', () => {
  beforeEach(() => {
    mockEthereumBrowser();
  });

  describe('on address changes', () => {
    test.skip('calls setWallet action when wallet address is changed', () => {});
  });
});
