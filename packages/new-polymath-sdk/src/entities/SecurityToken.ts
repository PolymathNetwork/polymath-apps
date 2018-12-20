import { Polymath } from '~/Polymath';
import { typeHelpers } from '@polymathnetwork/new-shared';

interface PartialSecurityToken {
  symbol: string;
  name: string;
}

type ArgsWithoutEntityProps<
  Procedure extends (...args: any[]) => any
> = typeHelpers.Omit<
  typeHelpers.ArgumentsType<Procedure>[0],
  typeHelpers.FilterPropNamesByType<SecurityToken, Function>
>;

export class SecurityToken {
  public symbol: string;
  public name: string;
  private polyClient: Polymath;

  constructor(
    params: PartialSecurityToken,
    polyClient: Polymath = {} as Polymath
  ) {
    if (!polyClient) {
      throw new Error(
        'SecurityToken entity class should always be initialized through the Polymath client'
      );
    }

    this.symbol = params.symbol;
    this.name = params.name;
    this.polyClient = polyClient || ({} as Polymath);
  }

  public reserve(
    args: ArgsWithoutEntityProps<Polymath['reserveSecurityToken']>
  ) {
    return this.polyClient.reserveSecurityToken({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });
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
