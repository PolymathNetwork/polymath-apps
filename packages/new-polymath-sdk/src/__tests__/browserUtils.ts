import { getNetworkId } from '../browserUtils';
import { delay } from '../utils';
import { mockEthereumBrowser } from '../testUtils';

describe('browserUtils', () => {
  describe('.getNetworkId', () => {
    let ethereumBrowserMock: {
      restore: () => void;
      load: () => void;
    };

    beforeEach(() => {
      ethereumBrowserMock = mockEthereumBrowser({
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
      await delay(0);

      expect(spy).not.toHaveBeenCalled();

      ethereumBrowserMock.load();

      await delay(150);

      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
