import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';
import BigNumber from 'bignumber.js';

interface UniqueIdentifiers {
  tokenAddress: string;
  walletAddress: string;
}

function isUniqueIdentifiers(
  identifiers: any
): identifiers is UniqueIdentifiers {
  const { tokenAddress, walletAddress } = identifiers;

  return typeof tokenAddress === 'string' && typeof walletAddress === 'string';
}

interface Params extends UniqueIdentifiers {
  tokenSymbol: string | null;
  balance: BigNumber;
}

export class Erc20TokenBalance extends Entity {
  public static generateId({ tokenAddress, walletAddress }: UniqueIdentifiers) {
    return serialize('erc20TokenBalance', {
      tokenAddress,
      walletAddress,
    });
  }

  public static unserialize(serialized: any) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong erc20 token balance ID format.');
    }

    return unserialized;
  }

  public uid: string;
  public tokenSymbol: string | null;
  public tokenAddress: string;
  public walletAddress: string;
  public balance: BigNumber;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { tokenSymbol, tokenAddress, balance, walletAddress } = params;

    this.tokenSymbol = tokenSymbol;
    this.tokenAddress = tokenAddress;
    this.balance = balance;
    this.walletAddress = walletAddress;
    this.uid = Erc20TokenBalance.generateId({
      tokenAddress,
      walletAddress,
    });
  }

  public toPojo() {
    const { uid, tokenSymbol, tokenAddress, balance, walletAddress } = this;

    return {
      uid,
      tokenSymbol,
      tokenAddress,
      balance,
      walletAddress,
    };
  }
}
