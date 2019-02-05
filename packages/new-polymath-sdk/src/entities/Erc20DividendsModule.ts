import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';

interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
}

export class Erc20DividendsModule extends Entity {
  public uid: string;
  public entityType: string = 'erc20DividendsModule';
  public address: string;
  public securityTokenSymbol: string;
  public securityTokenId: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const { address, securityTokenSymbol, securityTokenId } = params;

    this.address = address;
    this.securityTokenSymbol = securityTokenSymbol;
    this.securityTokenId = securityTokenId;
    this.uid = this.generateId();
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

  protected generateId() {
    const { securityTokenSymbol, entityType } = this;
    return serialize(entityType, {
      securityTokenSymbol,
    });
  }
}
