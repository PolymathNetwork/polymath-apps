import Web3 from 'web3';
import { Provider } from 'web3/types';

interface Params {
  provider: Provider;
}

export class PolymathBase {
  public provider: Provider;

  constructor({ provider }: Params) {
    this.provider = provider;
  }
}

// Temporary Hacky way to have good typing
export const Polymath = new PolymathBase({} as Params);
