import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';

interface UniqueIdentifiers {
  symbol: string;
}

function isUniqueIdentifiers(identifiers: any): identifiers is UniqueIdentifiers {
  const { symbol } = identifiers;

  return typeof symbol === 'string';
}

interface Params extends UniqueIdentifiers {
  name: string;
}

export class SecurityTokenReservation extends Entity {
  public static generateId({ symbol }: UniqueIdentifiers) {
    return serialize('securityTokenReservation', {
      symbol,
    });
  }

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong security token reservation ID format.');
    }

    return unserialized;
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

  public reserve = (args: { name: string }) =>
    this.polyClient.reserveSecurityToken({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });

  public createSecurityToken = (args: { name: string; detailsUrl?: string; divisible: boolean }) =>
    this.polyClient.createSecurityToken({
      ...args,
      securityTokenReservationId: this.uid,
      name: this.name,
    });

  public toPojo() {
    const { uid, symbol, name } = this;

    return { uid, symbol, name };
  }
}
