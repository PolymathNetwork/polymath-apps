import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';
import { Dividend } from './Dividend';
import { InvestorBalance } from '~/types';
import BigNumber from 'bignumber.js';

interface Params {
  dividends: Dividend[];
  securityTokenSymbol: string;
  securityTokenId: string;
  index: number;
  investorBalances: InvestorBalance[];
  totalSupply: BigNumber;
  createdAt: Date;
}

export class Checkpoint extends Entity {
  public uid: string;
  public entityType: string = 'checkpoint';
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
    this.uid = this.generateId();
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

  protected generateId() {
    const { securityTokenSymbol, index, entityType } = this;
    return serialize(entityType, {
      securityTokenSymbol,
      index,
    });
  }
}
