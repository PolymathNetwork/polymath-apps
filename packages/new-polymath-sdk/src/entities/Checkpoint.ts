import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';
import { Dividend } from './Dividend';
import { InvestorBalance } from '~/types';
import BigNumber from 'bignumber.js';

interface Params {
  dividends: Dividend[];
  securityTokenSymbol: string;
  id: number;
  investorBalances: InvestorBalance[];
  totalSupply: BigNumber;
  createdAt: Date;
}

export class Checkpoint extends Entity {
  public entityType: string = 'checkpoint';
  public dividends: Dividend[];
  public securityTokenSymbol: string;
  public id: number;
  public investorBalances: InvestorBalance[];
  public totalSupply: BigNumber;
  public createdAt: Date;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      dividends,
      securityTokenSymbol,
      id,
      investorBalances,
      totalSupply,
      createdAt,
    } = params;

    this.dividends = dividends;
    this.securityTokenSymbol = securityTokenSymbol;
    this.id = id;
    this.investorBalances = investorBalances;
    this.totalSupply = totalSupply;
    this.createdAt = createdAt;
  }

  protected generateId() {
    const { securityTokenSymbol, id, entityType } = this;
    return serialize(entityType, {
      securityTokenSymbol,
      id,
    });
  }
}
