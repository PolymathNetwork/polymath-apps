import Web3 from 'web3';
import { PolymathError } from '~/classes/Error';
import { ErrorCodes } from '~/types';
import { Provider } from 'react';
import { HttpProvider } from 'web3/providers';

export enum BrowserSupport {
  None = 'NONE',
  Legacy = 'LEGACY',
  Modern = 'MODERN',
}

interface Ethereum extends HttpProvider {
  networkversion: string;
  enable(): Promise<any>;
}
interface InjectedWeb3 extends Web3 {
  getAccounts: () => Promise<string[]>;
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

function isModern(obj: ExtendedWindow): obj is WindowWithEthereum {
  if (getBrowserSupport() === BrowserSupport.Modern) {
    return true;
  }
  return false;
}

function isLegacy(obj: ExtendedWindow): obj is WindowWithWeb3 {
  if (getBrowserSupport() === BrowserSupport.Legacy) {
    return true;
  }
  return false;
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

export async function getCurrentWallet() {
  const support = getBrowserSupport();

  let web3: Web3 = {} as Web3;

  if (isModern(win)) {
    await win.ethereum.enable();
    web3 = new Web3(win.ethereum as HttpProvider);
  } else if (isLegacy(win)) {
    return await win.web3.getAccounts();
    web3 = new Web3();
  } else if (support === BrowserSupport.None) {
    throw new PolymathError({ code: ErrorCodes.IncompatibleBrowser });
  }

  const accounts = await web3.eth.getAccounts();

  return accounts[0];
}
