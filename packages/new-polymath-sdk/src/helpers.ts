import Web3 from 'web3';

enum BrowserSupport {
  None = 'NONE',
  Legacy = 'LEGACY',
  Modern = 'MODERN',
}
interface ExtendedWindow extends Window {
  ethereum?: {
    networkversion: string;
  };
  web3?: Web3;
}

const win = (window as any) as ExtendedWindow;

/**
 * Returns the browser support for Ethereum
 */
export function getBrowserSupport() {
  if (!win) {
    return BrowserSupport.None;
  }
  if (win.ethereum) {
    return BrowserSupport.Modern;
  }
  if (win.web3) {
    return BrowserSupport.Legacy;
  } else {
    return BrowserSupport.None;
  }
}

/**
 * Returns the current networkId provided by the browser
 */
export function getNetworkId() {
  const support = getBrowserSupport();

  if (support === BrowserSupport.None) {
    return null;
  }

  if (support === BrowserSupport.Modern) {
    return Number((win as any).ethereum.networkVersion);
  }

  if (support === BrowserSupport.Legacy) {
    return (win as any).web3.version.network;
  }
}
