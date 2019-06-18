import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';
import { DividendModuleTypes, isDividendModuleTypes } from '../types';

interface UniqueIdentifiers {
  securityTokenId: string;
  checkpointId: string;
  dividendType: DividendModuleTypes;
  investorAddress: string;
}

function isUniqueIdentifiers(identifiers: any): identifiers is UniqueIdentifiers {
  const { securityTokenId, dividendType, investorAddress, checkpointIndex } = identifiers;

  return (
    typeof securityTokenId === 'string' &&
    isDividendModuleTypes(dividendType) &&
    typeof investorAddress === 'string' &&
    typeof checkpointIndex === 'number'
  );
}

interface Params extends UniqueIdentifiers {
  securityTokenSymbol: string;
  checkpointIndex: number;
  percentage: number;
}

export class TaxWithholding extends Entity {
  public static generateId({
    securityTokenId,
    dividendType,
    investorAddress,
    checkpointId,
  }: UniqueIdentifiers) {
    return serialize('taxWithholding', {
      securityTokenId,
      dividendType,
      investorAddress,
      checkpointId,
    });
  }

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong tax withholding ID format.');
    }

    return unserialized;
  }

  public uid: string;

  public securityTokenSymbol: string;

  public securityTokenId: string;

  public dividendType: DividendModuleTypes;

  public investorAddress: string;

  public checkpointId: string;

  public checkpointIndex: number;

  public percentage: number;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      securityTokenId,
      securityTokenSymbol,
      dividendType,
      investorAddress,
      percentage,
      checkpointIndex,
      checkpointId,
    } = params;

    this.securityTokenId = securityTokenId;
    this.securityTokenSymbol = securityTokenSymbol;
    this.dividendType = dividendType;
    this.investorAddress = investorAddress;
    this.percentage = percentage;
    this.checkpointIndex = checkpointIndex;
    (this.checkpointId = checkpointId),
      (this.uid = TaxWithholding.generateId({
        securityTokenId,
        investorAddress,
        dividendType,
        checkpointId,
      }));
  }

  public toPojo() {
    const {
      uid,
      securityTokenId,
      securityTokenSymbol,
      dividendType,
      investorAddress,
      percentage,
      checkpointIndex,
      checkpointId,
    } = this;

    return {
      uid,
      securityTokenId,
      securityTokenSymbol,
      dividendType,
      investorAddress,
      percentage,
      checkpointIndex,
      checkpointId,
    };
  }
}
