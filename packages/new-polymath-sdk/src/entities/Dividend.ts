import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';
import BigNumber from 'bignumber.js';
import { DividendModuleTypes, DividendInvestorStatus } from '~/types';

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
  investors: DividendInvestorStatus[];
  name: string;
  currency: string | null;
}

export class Dividend extends Entity {
  public static generateId({
    securityTokenSymbol,
    dividendType,
    index,
  }: {
    securityTokenSymbol: string;
    dividendType: DividendModuleTypes;
    index: number;
  }) {
    return serialize('dividend', {
      securityTokenSymbol,
      dividendType,
      index,
    });
  }
  public uid: string;
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
  public investors: DividendInvestorStatus[];
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
      investors,
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
    this.investors = investors;
    this.currency = currency;

    this.uid = Dividend.generateId({
      securityTokenSymbol,
      dividendType,
      index,
    });
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
      investors,
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
      investors,
      name,
      currency,
    };
  }
}
