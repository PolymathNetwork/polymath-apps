import Web3PromiEvent from 'web3-core-promievent';
import { GenericContract } from '../LowLevel/types';
import { PostTransactionResolver } from '../PostTransactionResolver';

const originalWindow = {
  ...window,
};

interface WindowWithEthereum extends Window {
  ethereum: {
    networkVersion: string;
    _metamask?: {
      isApproved: () => Promise<boolean>;
    };
    enable(): Promise<any>;
  };
}

interface WindowWithWeb3 extends Window {
  web3: {
    version: string;
  };
}

interface MockEthereumBrowserArgs {
  support?: 'legacy' | 'modern';
  options?: {
    networkId: number;
    loaded: boolean;
  };
}

export function mockEthereumBrowser({
  support = 'modern',
  options = {
    networkId: 1,
    loaded: true,
  },
}: MockEthereumBrowserArgs) {
  const { networkId, loaded } = options;

  if (support === 'modern') {
    window = (Object.assign(window, {
      ethereum: {
        networkVersion: loaded ? `${networkId}` : undefined,
      },
    }) as any) as WindowWithEthereum;
  }
  if (support === 'legacy') {
    window = Object.assign(window, {
      web3: {
        version: networkId,
      },
    } as any) as WindowWithWeb3;
  }

  return {
    restore: () => {
      window = originalWindow;
    },
    load: () => {
      if (support === 'modern') {
        (window as WindowWithEthereum).ethereum.networkVersion = `${networkId}`;
      }
      if (support === 'legacy') {
        (window as WindowWithWeb3).web3.version = `${networkId}`;
      }
    },
  };
}

export class MockedContract<T extends GenericContract> {
  public autoResolve: boolean;
  public errorMsg?: string;
  public fakeTxOnePromiEvent = new Web3PromiEvent();
  public fakeTxTwoPromiEvent = new Web3PromiEvent();
  public failureTxPromiEvent = new Web3PromiEvent();

  public fakeTxOne = jest.fn(async () => {
    return () => {
      if (this.autoResolve) {
        this.fakeTxOnePromiEvent.resolve();
      }
      return this.fakeTxOnePromiEvent.eventEmitter;
    };
  });
  public fakeTxTwo = jest.fn(async () => {
    return () => {
      if (this.autoResolve) {
        this.fakeTxTwoPromiEvent.resolve();
      }
      return this.fakeTxTwoPromiEvent.eventEmitter;
    };
  });

  public failureTx = jest.fn(async () => {
    return () => {
      const err = this.errorMsg || 'Test error';
      this.failureTxPromiEvent.reject(new Error(err));
      return this.failureTxPromiEvent.eventEmitter;
    };
  });

  constructor({
    autoResolve = true,
    errorMsg,
  }: { autoResolve?: boolean; errorMsg?: string } = {}) {
    this.autoResolve = autoResolve;
    this.errorMsg = errorMsg;
  }
}

export const getMockTransactionSpec = (
  method: (args: any) => Promise<any>,
  args: any,
  resolver = async () => {}
) => ({
  method,
  args,
  postTransactionResolver: new PostTransactionResolver(resolver),
});
