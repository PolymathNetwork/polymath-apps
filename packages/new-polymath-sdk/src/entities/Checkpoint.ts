import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';
import { Dividend } from './Dividend';
import { InvestorBalance } from '../types';

interface UniqueIdentifiers {
  symbol: string;
  index: number;
}

function isUniqueIdentifiers(
  identifiers: any
): identifiers is UniqueIdentifiers {
  const { symbol, index } = identifiers;

  return typeof symbol === 'string' && typeof index === 'number';
}

interface Params extends UniqueIdentifiers {
  dividends: Dividend[];
  symbol: string;
  investorBalances: InvestorBalance[];
  totalSupply: BigNumber;
  createdAt: Date;
}

export class Checkpoint extends Entity {
  public static generateId({ symbol, index }: UniqueIdentifiers) {
    return serialize('checkpoint', {
      symbol,
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

  public symbol: string;

  public index: number;

  public investorBalances: InvestorBalance[];

  public totalSupply: BigNumber;

  public createdAt: Date;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      dividends,
      symbol,
      index,
      investorBalances,
      totalSupply,
      createdAt,
    } = params;

    this.dividends = dividends;
    this.symbol = symbol;
    this.index = index;
    this.investorBalances = investorBalances;
    this.totalSupply = totalSupply;
    this.createdAt = createdAt;
    this.uid = Checkpoint.generateId({ symbol, index });
  }

  public toPojo() {
    const {
      uid,
      dividends,
      symbol,
      index,
      investorBalances,
      totalSupply,
      createdAt,
    } = this;

    return {
      uid,
      dividends: dividends.map(dividend => dividend.toPojo()),
      symbol,
      index,
      investorBalances,
      totalSupply,
      createdAt,
    };
  }
}
