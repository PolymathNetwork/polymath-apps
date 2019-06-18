import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';

interface UniqueIdentifiers {
  securityTokenSymbol: string;
  stoModuleId: string;
  index: number;
}

function isUniqueIdentifiers(identifiers: any): identifiers is UniqueIdentifiers {
  const { securityTokenSymbol, stoModuleId, index } = identifiers;

  return (
    typeof securityTokenSymbol === 'string' &&
    typeof stoModuleId === 'string' &&
    typeof index === 'number'
  );
}

interface Params extends UniqueIdentifiers {
  securityTokenId: string;
  address: string;
  tokenAmount: BigNumber;
  investedFunds: BigNumber;
}

export class Investment extends Entity {
  public static generateId({ securityTokenSymbol, stoModuleId, index }: UniqueIdentifiers) {
    return serialize('investment', {
      securityTokenSymbol,
      stoModuleId,
      index,
    });
  }

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong investment ID format.');
    }

    return unserialized;
  }

  public uid: string;

  public securityTokenSymbol: string;

  public securityTokenId: string;

  public stoModuleId: string;

  public address: string;

  public index: number;

  public tokenAmount: BigNumber;

  public investedFunds: BigNumber;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      securityTokenId,
      securityTokenSymbol,
      stoModuleId,
      address,
      index,
      tokenAmount,
      investedFunds,
    } = params;

    this.securityTokenId = securityTokenId;
    this.securityTokenSymbol = securityTokenSymbol;
    this.stoModuleId = stoModuleId;
    this.address = address;
    this.index = index;
    this.tokenAmount = tokenAmount;
    this.investedFunds = investedFunds;
    this.uid = Investment.generateId({
      securityTokenSymbol,
      stoModuleId,
      index,
    });
  }

  public toPojo() {
    const {
      uid,
      securityTokenId,
      securityTokenSymbol,
      stoModuleId,
      address,
      index,
      tokenAmount,
      investedFunds,
    } = this;

    return {
      uid,
      securityTokenId,
      securityTokenSymbol,
      stoModuleId,
      address,
      index,
      tokenAmount,
      investedFunds,
    };
  }
}
