import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';

interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
}

export abstract class DividendsModule extends Entity {
  public abstract uid: string;
  public address: string;
  public securityTokenSymbol: string;
  public securityTokenId: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { address, securityTokenSymbol, securityTokenId } = params;

    this.address = address;
    this.securityTokenSymbol = securityTokenSymbol;
    this.securityTokenId = securityTokenId;
  }

  public toPojo() {
    const { uid, address, securityTokenSymbol, securityTokenId } = this;

    return {
      uid,
      address,
      securityTokenSymbol,
      securityTokenId,
    };
  }
}
