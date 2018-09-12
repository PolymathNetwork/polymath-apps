// @flow

import artifact from 'polymath-core/build/contracts/CountTransferManager.json';

import Contract from './Contract';
import type { Address, Web3Receipt } from '../../types';

export default class CountTransferManager extends Contract {
  maxHolderCount: () => Promise<number>;
  paused: () => Promise<boolean>;

  pause: () => Promise<Web3Receipt>;
  unpause: () => Promise<Web3Receipt>;

  constructor(at: Address) {
    super(artifact, at);
  }

  async changeHolderCount(count: number): Promise<Web3Receipt> {
    return this._tx(this._methods.changeHolderCount(count));
  }
}
