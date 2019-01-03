import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';
import BigNumber from 'bignumber.js';

interface Params {
  id: number;
  checkpointId: number;
  securityTokenSymbol: string;
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
  public entityType: string = 'dividend';
  public id: number;
  public checkpointId: number;
  public securityTokenSymbol: string;
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
      id,
      checkpointId,
      securityTokenSymbol,
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

    this.id = id;
    this.checkpointId = checkpointId;
    this.securityTokenSymbol = securityTokenSymbol;
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
  }

  protected generateId() {
    const { securityTokenSymbol, checkpointId, id, entityType } = this;

    return serialize(entityType, {
      securityTokenSymbol,
      checkpointId,
      id,
    });
  }
}
