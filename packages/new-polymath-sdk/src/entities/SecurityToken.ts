import { Polymath } from '~/Polymath';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Entity } from '~/entities/Entity';

interface Params {
  symbol: string;
  name: string;
}

type ArgsWithoutEntityProps<
  Procedure extends (...args: any[]) => any
> = typeHelpers.Omit<
  typeHelpers.ArgumentsType<Procedure>[0],
  typeHelpers.FilterPropNamesByType<SecurityToken, Function>
>;

export class SecurityToken extends Entity {
  public symbol: string;
  public name: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    this.symbol = params.symbol;
    this.name = params.name;
  }

  public enableDividendModules(
    args: ArgsWithoutEntityProps<Polymath['enableDividendModules']>
  ) {
    return this.polyClient.enableDividendModules({
      ...args,
      symbol: this.symbol,
    });
  }

  public createCheckpoint(
    args: ArgsWithoutEntityProps<Polymath['createCheckpoint']>
  ) {
    return this.polyClient.createCheckpoint({ ...args, symbol: this.symbol });
  }

  public distributePolyDividends(
    args: ArgsWithoutEntityProps<Polymath['distributePolyDividends']>
  ) {
    return this.polyClient.distributePolyDividends({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });
  }
}
