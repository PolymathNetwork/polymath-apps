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
