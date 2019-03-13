import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';
import BigNumber from 'bignumber.js';

interface Params {
  tokenSymbol: string | null;
  tokenAddress: string;
  balance: BigNumber;
}

export class Erc20TokenBalance extends Entity {
  public static generateId({ tokenAddress }: { tokenAddress: string }) {
    return serialize('erc20TokenBalance', {
      tokenAddress,
    });
  }
  public uid: string;
  public tokenSymbol: string | null;
  public tokenAddress: string;
  public balance: BigNumber;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { tokenSymbol, tokenAddress, balance } = params;

    this.tokenSymbol = tokenSymbol;
    this.tokenAddress = tokenAddress;
    this.balance = balance;
    this.uid = Erc20TokenBalance.generateId({
      tokenAddress,
    });
  }

  public toPojo() {
    const { uid, tokenSymbol, tokenAddress, balance } = this;

    return {
      uid,
      tokenSymbol,
      tokenAddress,
      balance,
    };
  }
}
