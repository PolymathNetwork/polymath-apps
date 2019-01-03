import { typeHelpers } from '@polymathnetwork/new-shared';
import { Polymath } from '~/Polymath';
import { Entity } from '~/entities/Entity';
import { serialize } from '~/utils';

interface Params {
  symbol: string;
  name: string;
  address: string;
}

export class SecurityToken extends Entity {
  public entityType: string = 'securityToken';
  public symbol: string;
  public name: string;
  public address: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    this.symbol = params.symbol;
    this.name = params.name;
    this.address = params.address;
  }

  public enableDividendModules(
    args: typeHelpers.ArgsWithoutEntityProps<
      Polymath['enableDividendModules'],
      SecurityToken
    >
  ) {
    return this.polyClient.enableDividendModules({
      ...args,
      symbol: this.symbol,
    });
  }

  public createCheckpoint(
    args: typeHelpers.ArgsWithoutEntityProps<
      Polymath['createCheckpoint'],
      SecurityToken
    >
  ) {
    return this.polyClient.createCheckpoint({ ...args, symbol: this.symbol });
  }

  public distributePolyDividends(
    args: typeHelpers.ArgsWithoutEntityProps<
      Polymath['distributePolyDividends'],
      SecurityToken
    >
  ) {
    return this.polyClient.distributePolyDividends({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });
  }

  protected generateId() {
    const { entityType, address } = this;
    return serialize(entityType, {
      address,
    });
  }
}
