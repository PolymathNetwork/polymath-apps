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
  public static generateId({
    securityTokenSymbol,
    dividendType,
    investorAddress,
  }: {
    securityTokenSymbol: string;
    dividendType: DividendModuleTypes;
    investorAddress: string;
  }) {
    return serialize('taxWithholding', {
      securityTokenSymbol,
      dividendType,
      investorAddress,
    });
  }
  public uid: string;
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
    this.uid = TaxWithholding.generateId({
      securityTokenSymbol,
      investorAddress,
      dividendType,
    });
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
}
