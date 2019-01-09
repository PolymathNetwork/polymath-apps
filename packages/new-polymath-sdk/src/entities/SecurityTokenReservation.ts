import { typeHelpers } from '@polymathnetwork/new-shared';
import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';

interface Params {
  symbol: string;
  name: string;
}

export class SecurityTokenReservation extends Entity {
  public uid: string;
  public entityType = 'securityTokenReservation';
  public symbol: string;
  public name: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { symbol, name } = params;

    this.symbol = symbol;
    this.name = name;
    this.uid = this.generateId();
  }

  public reserve(
    args: typeHelpers.ArgsWithoutEntityProps<
      Polymath['reserveSecurityToken'],
      SecurityTokenReservation
    >
  ) {
    return this.polyClient.reserveSecurityToken({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });
  }

  public createSecurityToken(
    args: typeHelpers.ArgsWithoutEntityProps<
      Polymath['createSecurityToken'],
      SecurityTokenReservation
    >
  ) {
    return this.polyClient.createSecurityToken({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });
  }

  public toPojo() {
    const { uid, symbol, name } = this;

    return { uid, symbol, name };
  }

  protected generateId() {
    const { symbol, entityType } = this;

    return serialize(entityType, {
      symbol,
    });
  }
}
