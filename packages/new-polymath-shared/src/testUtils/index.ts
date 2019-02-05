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
