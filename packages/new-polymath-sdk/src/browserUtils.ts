import Web3 from 'web3';
import { HttpProvider } from 'web3/providers';
import { PolymathError } from './PolymathError';
import { ErrorCodes } from './types';
import { delay } from './utils';

export enum BrowserSupport {
  None = 'NONE',
  Legacy = 'LEGACY',
  Modern = 'MODERN',
}

interface Ethereum extends HttpProvider {
  networkVersion: string;
  _metamask?: {
    isApproved: () => Promise<boolean>;
  };
  enable(): Promise<any>;
}

type Web3Eth = Web3['eth'];
type Web3Accounts = Web3['eth']['accounts'];
interface Accounts extends Web3Accounts, Array<string> {}
interface Eth extends Web3Eth {
  accounts: Accounts;
}

interface InjectedWeb3 extends Web3 {
  eth: Eth;
}

interface ExtendedWindow extends Window {
  ethereum?: Ethereum;
  web3?: InjectedWeb3;
}

interface WindowWithEthereum extends ExtendedWindow {
  ethereum: Ethereum;
}
interface WindowWithWeb3 extends ExtendedWindow {
  web3: InjectedWeb3;
}

export function getWeb3() {
  // Initialize a Web3 instance for internal use
  const win = (window as any) as ExtendedWindow;
  let web3: InjectedWeb3;

  if (isModern(win)) {
    web3 = new Web3(win.ethereum as HttpProvider) as InjectedWeb3;
  } else if (isLegacy(win)) {
    web3 = new Web3(win.web3.currentProvider) as InjectedWeb3;
  } else {
    return new Web3();
  }

  return web3;
}

function isModern(obj: ExtendedWindow): obj is WindowWithEthereum {
  return getBrowserSupport() === BrowserSupport.Modern;
}

function isLegacy(obj: ExtendedWindow): obj is WindowWithWeb3 {
  return getBrowserSupport() === BrowserSupport.Legacy;
}

function isUnsupported(obj: ExtendedWindow): obj is ExtendedWindow {
  return getBrowserSupport() === BrowserSupport.None;
}
/**
 * Returns the browser support for Ethereum
 */
export function getBrowserSupport() {
  const win = window as ExtendedWindow;
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
export async function getNetworkId(): Promise<number | null> {
  const win: ExtendedWindow = window as ExtendedWindow;

  let rawNetworkId: string | undefined;

  if (isModern(win)) {
    rawNetworkId = win.ethereum.networkVersion;
  } else if (isLegacy(win)) {
    rawNetworkId = win.web3.version;
  } else {
    return null;
  }

  if (rawNetworkId === 'loading' || !rawNetworkId) {
    await delay(50);
    return getNetworkId();
  }

  return parseInt(rawNetworkId, 10);
}

export async function getCurrentAddress() {
  const win = window as ExtendedWindow;
  const web3 = getWeb3();
  let accounts: string[] = [];
  const support = getBrowserSupport();

  if (isModern(win)) {
    // Special check for Metamask to know if it is locked or not
    if (win.ethereum._metamask) {
      const isApproved = await win.ethereum._metamask.isApproved();
      if (isApproved) {
        accounts = await web3.eth.getAccounts();
        if (!accounts.length) {
          throw new PolymathError({ code: ErrorCodes.WalletIsLocked });
        }
      }
    }
    await enableWallet();
  } else if (isLegacy(win)) {
    return await (web3 as InjectedWeb3).eth.getAccounts();
  } else if (support === BrowserSupport.None) {
    throw new PolymathError({ code: ErrorCodes.IncompatibleBrowser });
  }

  if (!accounts.length) {
    accounts = await web3.eth.getAccounts();
  }

  if (!accounts.length) {
    throw new PolymathError({ code: ErrorCodes.WalletIsLocked });
  }

  return accounts[0];
}

/**
 * Runs the callback anytime the wallet address changes in the browser
 */
export function onAddressChange(cb: (newAddress: string, previousAddress?: string) => any) {
  const web3 = getWeb3() as InjectedWeb3;
  const support = getBrowserSupport();
  if (support === BrowserSupport.None) {
    // eslint:disable-next-line no-console
    console.warn(
      '"onAddressChange" Was called, but the current browser does not support Ethereum.'
    );
    return () => {};
  }

  let previousAddress = web3.eth.accounts[0];

  const interval = setInterval(async () => {
    const newAddress = (await web3.eth.getAccounts())[0];

    if (previousAddress !== newAddress) {
      previousAddress = newAddress;
      cb(newAddress, previousAddress);
    }
  }, 1000);

  const unsubscribe = () => {
    clearInterval(interval);
  };

  return unsubscribe;
}

export async function enableWallet() {
  const support = getBrowserSupport();
  const win = window as ExtendedWindow;
  if (support !== BrowserSupport.Modern) {
    throw new Error("Called login on a browser that doesn't support Ethereum");
  }

  try {
    await (win.ethereum as Ethereum).enable();
  } catch (err) {
    throw new PolymathError({ code: ErrorCodes.UserDeniedAccess });
  }
}
