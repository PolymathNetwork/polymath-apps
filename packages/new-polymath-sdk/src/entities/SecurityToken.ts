import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { Entity } from '../entities/Entity';
import { serialize, unserialize } from '../utils';
import { DividendModuleTypes } from '../LowLevel/types';
import { TaxWithholdingEntry } from '../types';

interface UniqueIdentifiers {
  symbol: string;
}

function isUniqueIdentifiers(
  identifiers: any
): identifiers is UniqueIdentifiers {
  const { symbol } = identifiers;

  return typeof symbol === 'string';
}

interface Params extends UniqueIdentifiers {
  name: string;
  address: string;
  owner: string;
}

export class SecurityToken extends Entity {
  public static generateId({ symbol }: UniqueIdentifiers) {
    return serialize('securityToken', {
      symbol,
    });
  }

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong security token ID format.');
    }

    return unserialized;
  }

  public uid: string;

  public symbol: string;

  public name: string;

  public owner: string;

  public address: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { symbol, name, address, owner } = params;

    this.symbol = symbol;
    this.name = name;
    this.owner = owner;
    this.address = address;
    this.uid = SecurityToken.generateId({ symbol });
  }

  public getErc20DividendsModule = () =>
    this.polyClient.getErc20DividendsModule({
      symbol: this.symbol,
    });

  public enableDividendModules = (args: {
    storageWalletAddress: string;
    types: DividendModuleTypes[];
  }) =>
    this.polyClient.enableDividendModules({
      ...args,
      symbol: this.symbol,
    });

  public getCheckpoints = (args: { dividendTypes: DividendModuleTypes[] }) =>
    this.polyClient.getCheckpoints({
      ...args,
      symbol: this.symbol,
    });

  public getCheckpoint = (args: {
    checkpointId: number;
    dividendTypes: DividendModuleTypes[];
  }) =>
    this.polyClient.getCheckpoint({
      ...args,
      symbol: this.symbol,
    });

  public createCheckpoint = () =>
    this.polyClient.createCheckpoint({ symbol: this.symbol });

  public createPolyDividendDistribution = (args: {
    maturityDate: Date;
    expiryDate: Date;
    amount: BigNumber;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) =>
    this.polyClient.createPolyDividendDistribution({
      ...args,
      symbol: this.symbol,
    });

  public createErc20DividendDistribution = (args: {
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: BigNumber;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) =>
    this.polyClient.createErc20DividendDistribution({
      ...args,
      symbol: this.symbol,
    });

  public createEthDividendDistribution = (args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: BigNumber;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) =>
    this.polyClient.createEthDividendDistribution({
      ...args,
      symbol: this.symbol,
    });

  public toPojo() {
    const { uid, symbol, name, address } = this;

    return { uid, symbol, name, address };
  }
}
