import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';
import { DividendModuleTypes, DividendInvestorStatus, isDividendModuleTypes } from '../types';

interface UniqueIdentifiers {
  securityTokenId: string;
  checkpointId: string;
  dividendType: DividendModuleTypes;
  index: number;
}

function isUniqueIdentifiers(identifiers: any): identifiers is UniqueIdentifiers {
  const { securityTokenId, checkpointId, dividendType, index } = identifiers;

  return (
    typeof securityTokenId === 'string' &&
    typeof checkpointId === 'string' &&
    typeof index === 'number' &&
    isDividendModuleTypes(dividendType)
  );
}

interface Params extends UniqueIdentifiers {
  securityTokenSymbol: string;
  created: Date;
  maturity: Date;
  expiry: Date;
  amount: BigNumber;
  claimedAmount: BigNumber;
  totalSupply: BigNumber;
  reclaimed: boolean;
  totalWithheld: BigNumber;
  totalWithheldWithdrawn: BigNumber;
  investors: DividendInvestorStatus[];
  name: string;
  currency: string | null;
}

export class Dividend extends Entity {
  public static generateId({
    securityTokenId,
    checkpointId,
    dividendType,
    index,
  }: UniqueIdentifiers) {
    return serialize('dividend', {
      securityTokenId,
      checkpointId,
      dividendType,
      index,
    });
  }

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong dividend ID format.');
    }

    return unserialized;
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

  public totalWithheld: BigNumber;

  public totalWithheldWithdrawn: BigNumber;

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
      totalWithheld,
      totalWithheldWithdrawn,
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
    this.totalWithheld = totalWithheld;
    this.totalWithheldWithdrawn = totalWithheldWithdrawn;
    this.name = name;
    this.investors = investors;
    this.currency = currency;

    this.uid = Dividend.generateId({
      securityTokenId,
      checkpointId,
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
      totalWithheld,
      totalWithheldWithdrawn,
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
      totalWithheld,
      totalWithheldWithdrawn,
      investors,
      name,
      currency,
    };
  }
}
