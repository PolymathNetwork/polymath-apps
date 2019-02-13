import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';
import { DividendModuleTypes } from '~/types';

interface Params {
  securityTokenSymbol: string;
  securityTokenId: string;
  dividendType: DividendModuleTypes;
  investorAddress: string;
  percentage: number;
}

export class TaxWithholding extends Entity {
  public uid: string;
  public entityType: string = 'taxWithholding';
  public securityTokenSymbol: string;
  public securityTokenId: string;
  public dividendType: DividendModuleTypes;
  public investorAddress: string;
  public percentage: number;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      securityTokenId,
      securityTokenSymbol,
      dividendType,
      investorAddress,
      percentage,
    } = params;

    this.securityTokenId = securityTokenId;
    this.securityTokenSymbol = securityTokenSymbol;
    this.dividendType = dividendType;
    this.investorAddress = investorAddress;
    this.percentage = percentage;
    this.uid = this.generateId();
  }

  public toPojo() {
    const {
      uid,
      securityTokenId,
      securityTokenSymbol,
      dividendType,
      investorAddress,
      percentage,
    } = this;

    return {
      uid,
      securityTokenId,
      securityTokenSymbol,
      dividendType,
      investorAddress,
      percentage,
    };
  }

  protected generateId() {
    const {
      entityType,
      securityTokenSymbol,
      dividendType,
      investorAddress,
    } = this;

    return serialize(entityType, {
      securityTokenSymbol,
      dividendType,
      investorAddress,
    });
  }
}
