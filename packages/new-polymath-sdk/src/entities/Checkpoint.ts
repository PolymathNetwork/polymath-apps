import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';
import { Dividend } from './Dividend';
import { InvestorBalance } from '../types';

interface UniqueIdentifiers {
  securityTokenId: string;
  index: number;
}

function isUniqueIdentifiers(identifiers: any): identifiers is UniqueIdentifiers {
  const { securityTokenSymbol, index } = identifiers;

  return typeof securityTokenSymbol === 'string' && typeof index === 'number';
}

interface Params extends UniqueIdentifiers {
  dividends: Dividend[];
  securityTokenSymbol: string;
  investorBalances: InvestorBalance[];
  totalSupply: BigNumber;
  createdAt: Date;
}

export class Checkpoint extends Entity {
  public static generateId({ securityTokenId, index }: UniqueIdentifiers) {
    return serialize('checkpoint', {
      securityTokenId,
      index,
    });
  }

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong checkpoint ID format.');
    }

    return unserialized;
  }

  public uid: string;

  public dividends: Dividend[];

  public securityTokenSymbol: string;

  public securityTokenId: string;

  public index: number;

  public investorBalances: InvestorBalance[];

  public totalSupply: BigNumber;

  public createdAt: Date;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      dividends,
      securityTokenSymbol,
      securityTokenId,
      index,
      investorBalances,
      totalSupply,
      createdAt,
    } = params;

    this.dividends = dividends;
    this.securityTokenSymbol = securityTokenSymbol;
    this.securityTokenId = securityTokenId;
    this.index = index;
    this.investorBalances = investorBalances;
    this.totalSupply = totalSupply;
    this.createdAt = createdAt;
    this.uid = Checkpoint.generateId({ securityTokenId, index });
  }

  public toPojo() {
    const {
      uid,
      dividends,
      securityTokenSymbol,
      securityTokenId,
      index,
      investorBalances,
      totalSupply,
      createdAt,
    } = this;

    return {
      uid,
      dividends: dividends.map(dividend => dividend.toPojo()),
      securityTokenSymbol,
      securityTokenId,
      index,
      investorBalances,
      totalSupply,
      createdAt,
    };
  }
}
