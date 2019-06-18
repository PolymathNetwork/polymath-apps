import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { unserialize } from '../utils';
import { DividendModuleTypes, isDividendModuleTypes } from '../types';

export interface UniqueIdentifiers {
  securityTokenId: string;
  dividendType: DividendModuleTypes;
}

function isUniqueIdentifiers(identifiers: any): identifiers is UniqueIdentifiers {
  const { securityTokenId, dividendType } = identifiers;

  return typeof securityTokenId === 'string' && isDividendModuleTypes(dividendType);
}

export interface Params extends UniqueIdentifiers {
  address: string;
  securityTokenSymbol: string;
  storageWalletAddress: string;
}

export abstract class DividendsModule extends Entity {
  public abstract uid: string;

  public address: string;

  public securityTokenSymbol: string;

  public securityTokenId: string;

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

    const {
      address,
      securityTokenSymbol,
      securityTokenId,
      storageWalletAddress,
      dividendType,
    } = params;

    this.address = address;
    this.securityTokenSymbol = securityTokenSymbol;
    this.securityTokenId = securityTokenId;
    this.storageWalletAddress = storageWalletAddress;
    this.dividendType = dividendType;
  }

  public toPojo() {
    const {
      uid,
      address,
      securityTokenSymbol,
      securityTokenId,
      storageWalletAddress,
      dividendType,
    } = this;

    return {
      uid,
      address,
      securityTokenSymbol,
      securityTokenId,
      storageWalletAddress,
      dividendType,
    };
  }
}
