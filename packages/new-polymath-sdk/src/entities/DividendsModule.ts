import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { unserialize } from '../utils';
import { DividendModuleTypes, isDividendModuleTypes } from '../types';

export interface UniqueIdentifiers {
  symbol: string;
  dividendType: DividendModuleTypes;
}

function isUniqueIdentifiers(
  identifiers: any
): identifiers is UniqueIdentifiers {
  const { symbol, dividendType } = identifiers;

  return typeof symbol === 'string' && isDividendModuleTypes(dividendType);
}

export interface Params extends UniqueIdentifiers {
  address: string;
  symbol: string;
  storageWalletAddress: string;
}

export abstract class DividendsModule extends Entity {
  public abstract uid: string;

  public address: string;

  public symbol: string;

  public storageWalletAddress: string;

  public dividendType: DividendModuleTypes;

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong dividends module ID format.');
    }

    return unserialized;
  }

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { address, symbol, storageWalletAddress, dividendType } = params;

    this.address = address;
    this.symbol = symbol;
    this.storageWalletAddress = storageWalletAddress;
    this.dividendType = dividendType;
  }

  public toPojo() {
    const { uid, address, symbol, storageWalletAddress, dividendType } = this;

    return {
      uid,
      address,
      symbol,
      storageWalletAddress,
      dividendType,
    };
  }
}
