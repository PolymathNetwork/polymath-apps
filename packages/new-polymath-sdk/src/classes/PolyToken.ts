import { blockchainStub } from '~/blockchainStub';
import { Polymath } from '~/classes';
import { Erc20Token } from './Erc20Token';

export class PolyToken extends Erc20Token {
  public async getTokens() {
    return blockchainStub[Polymath.currentWallet].balance;
  }
}
