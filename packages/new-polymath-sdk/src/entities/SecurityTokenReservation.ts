import { typeHelpers } from '@polymathnetwork/new-shared';
import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';

interface Params {
  symbol: string;
  name: string;
}

interface ExcludedArgs {
  symbol: string;
}

export class SecurityTokenReservation extends Entity {
  public static generateId({ symbol }: { symbol: string }) {
    return serialize('securityTokenReservation', {
      symbol,
    });
  }
  public uid: string;
  public symbol: string;
  public name: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { symbol, name } = params;

    this.symbol = symbol;
    this.name = name;
    this.uid = SecurityTokenReservation.generateId({ symbol });
  }

  public reserve = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['reserveSecurityToken'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.reserveSecurityToken({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });

  public createSecurityToken = (
    args: typeHelpers.OmitFromProcedureArgs<
      Polymath['createSecurityToken'],
      ExcludedArgs
    >
  ) =>
    this.polyClient.createSecurityToken({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });

  public toPojo() {
    const { uid, symbol, name } = this;

    return { uid, symbol, name };
  }
}
