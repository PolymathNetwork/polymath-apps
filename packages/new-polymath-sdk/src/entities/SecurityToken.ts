import { typeHelpers } from '@polymathnetwork/new-shared';
import { Polymath } from '~/Polymath';
import { Entity } from '~/entities/Entity';
import { serialize } from '~/utils';

interface Params {
  symbol: string;
  name: string;
  address: string;
}

interface ExcludedArgs {
  symbol: string;
}

export class SecurityToken extends Entity {
  public uid: string;
  public entityType: string = 'securityToken';
  public symbol: string;
  public name: string;
  public address: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { symbol, name, address } = params;

    this.symbol = symbol;
    this.name = name;
    this.address = address;
    this.uid = this.generateId();
  }

  public getErc20DividendsModule = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['getErc20DividendsModule'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.getErc20DividendsModule({
      ...args,
      symbol: this.symbol,
    });

  public enableDividendModules = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['enableDividendModules'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.enableDividendModules({
      ...args,
      symbol: this.symbol,
    });

  public getCheckpoints = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['getCheckpoints'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.getCheckpoints({
      ...args,
      symbol: this.symbol,
    });

  public getCheckpoint = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['getCheckpoint'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.getCheckpoint({
      ...args,
      symbol: this.symbol,
    });

  public createCheckpoint = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['createCheckpoint'],
      ExcludedArgs
    >
  ) => this.polyClient.createCheckpoint({ ...args, symbol: this.symbol });

  public distributePolyDividends = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['distributePolyDividends'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.distributePolyDividends({
      ...args,
      symbol: this.symbol,
    });

  public distributeErc20Dividends = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['distributeErc20Dividends'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.distributeErc20Dividends({
      ...args,
      symbol: this.symbol,
    });

  public distributeEtherDividends = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['distributeEtherDividends'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.distributeEtherDividends({
      ...args,
      symbol: this.symbol,
    });

  public toPojo() {
    const { uid, symbol, name, address } = this;

    return { uid, symbol, name, address };
  }

  protected generateId() {
    const { entityType, address } = this;
    return serialize(entityType, {
      address,
    });
  }
}
