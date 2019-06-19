import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';
import { DividendModuleTypes, isDividendModuleTypes } from '../types';

interface UniqueIdentifiers {
  symbol: string;
  checkpointId: number;
  dividendType: DividendModuleTypes;
  investorAddress: string;
}

function isUniqueIdentifiers(
  identifiers: any
): identifiers is UniqueIdentifiers {
  const { symbol, dividendType, investorAddress, checkpointId } = identifiers;

  return (
    typeof symbol === 'string' &&
    isDividendModuleTypes(dividendType) &&
    typeof investorAddress === 'string' &&
    typeof checkpointId === 'number'
  );
}

interface Params extends UniqueIdentifiers {
  symbol: string;
  checkpointId: number;
  percentage: number;
}

export class TaxWithholding extends Entity {
  public static generateId({
    symbol,
    dividendType,
    investorAddress,
    checkpointId,
  }: UniqueIdentifiers) {
    return serialize('taxWithholding', {
      symbol,
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

  public symbol: string;

  public dividendType: DividendModuleTypes;

  public investorAddress: string;

  public checkpointId: number;

  public percentage: number;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      symbol,
      dividendType,
      investorAddress,
      percentage,
      checkpointId,
    } = params;

    this.symbol = symbol;
    this.dividendType = dividendType;
    this.investorAddress = investorAddress;
    this.percentage = percentage;
    this.checkpointId = checkpointId;
  }

  public toPojo() {
    const {
      uid,
      symbol,
      dividendType,
      investorAddress,
      percentage,
      checkpointId,
    } = this;

    return {
      uid,
      symbol,
      dividendType,
      investorAddress,
      percentage,
      checkpointId,
    };
  }
}
