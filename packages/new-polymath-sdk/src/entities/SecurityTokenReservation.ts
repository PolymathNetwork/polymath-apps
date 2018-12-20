import { typeHelpers } from '@polymathnetwork/new-shared';
import { Polymath } from '~/Polymath';
import { Entity } from '~/entities/Entity';

interface Params {
  symbol: string;
  name: string;
}

// TODO @RafaelVidaurre: type as undefined if object inferred has no props
type ArgsWithoutEntityProps<
  Procedure extends (...args: any[]) => any
> = typeHelpers.Omit<
  typeHelpers.ArgumentsType<Procedure>[0],
  typeHelpers.FilterPropNamesByType<SecurityTokenReservation, Function>
>;

export class SecurityTokenReservation extends Entity {
  public symbol: string;
  public name: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    this.symbol = params.symbol;
    this.name = params.name;
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

  public createSecurityToken(
    args: ArgsWithoutEntityProps<Polymath['createSecurityToken']>
  ) {
    return this.polyClient.createSecurityToken({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });
  }
}
