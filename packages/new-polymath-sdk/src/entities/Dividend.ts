import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';
import BigNumber from 'bignumber.js';
import { DividendModuleTypes } from '~/types';

interface Params {
  index: number;
  checkpointId: string;
  dividendType: DividendModuleTypes;
  securityTokenSymbol: string;
  securityTokenId: string;
  created: Date;
  maturity: Date;
  expiry: Date;
  amount: BigNumber;
  claimedAmount: BigNumber;
  totalSupply: BigNumber;
  reclaimed: boolean;
  dividendWithheld: BigNumber;
  dividendWithheldReclaimed: BigNumber;
  name: string;
  currency: string | null;
}

export class Dividend extends Entity {
  public uid: string;
  public entityType: string = 'dividend';
  public index: number;
  public checkpointId: string;
  public dividendType: DividendModuleTypes;
  public securityTokenSymbol: string;
  public securityTokenId: string;
  public created: Date;
  public maturity: Date;
  public expiry: Date;
  public amount: BigNumber;
  public claimedAmount: BigNumber;
  public totalSupply: BigNumber;
  public reclaimed: boolean;
  public dividendWithheld: BigNumber;
  public dividendWithheldReclaimed: BigNumber;
  public name: string;
  public currency: string | null;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      index,
      checkpointId,
      dividendType,
      securityTokenSymbol,
      securityTokenId,
      created,
      maturity,
      expiry,
      amount,
      claimedAmount,
      totalSupply,
      reclaimed,
      dividendWithheld,
      dividendWithheldReclaimed,
      name,
      currency,
    } = params;

    this.index = index;
    this.checkpointId = checkpointId;
    this.dividendType = dividendType;
    this.securityTokenSymbol = securityTokenSymbol;
    this.securityTokenId = securityTokenId;
    this.created = created;
    this.maturity = maturity;
    this.expiry = expiry;
    this.amount = amount;
    this.claimedAmount = claimedAmount;
    this.totalSupply = totalSupply;
    this.reclaimed = reclaimed;
    this.dividendWithheld = dividendWithheld;
    this.dividendWithheldReclaimed = dividendWithheldReclaimed;
    this.name = name;
    this.currency = currency;
    this.uid = this.generateId();
  }

  public toPojo() {
    const {
      uid,
      index,
      checkpointId,
      dividendType,
      securityTokenSymbol,
      securityTokenId,
      created,
      maturity,
      expiry,
      amount,
      claimedAmount,
      totalSupply,
      reclaimed,
      dividendWithheld,
      dividendWithheldReclaimed,
      name,
      currency,
    } = this;

    return {
      uid,
      index,
      checkpointId,
      dividendType,
      securityTokenSymbol,
      securityTokenId,
      created,
      maturity,
      expiry,
      amount,
      claimedAmount,
      totalSupply,
      reclaimed,
      dividendWithheld,
      dividendWithheldReclaimed,
      name,
      currency,
    };
  }

  protected generateId() {
    const { securityTokenSymbol, dividendType, index, entityType } = this;

    return serialize(entityType, {
      securityTokenSymbol,
      dividendType,
      index,
    });
  }
}
