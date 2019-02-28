import { getNetworkId } from '../browserUtils';
import { testUtils, utils } from '@polymathnetwork/new-shared';

describe('browserUtils', () => {
  describe('.getNetworkId', () => {
    let ethereumBrowserMock: {
      restore: () => void;
      load: () => void;
    };

    beforeEach(() => {
      ethereumBrowserMock = testUtils.mockEthereumBrowser({
        options: {
          networkId: 1,
          loaded: false,
        },
      });
    });
    test('should wait until Metamask has loaded', async () => {
      const promise = getNetworkId();

      const spy = jest.fn();
      promise.then(spy);

      // Force asyncrony
      await utils.delay(0);

      expect(spy).not.toHaveBeenCalled();

      ethereumBrowserMock.load();

      await utils.delay(150);

      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
