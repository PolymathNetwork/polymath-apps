import { Polymath } from '~/Polymath';
import { Entity } from './Entity';
import { serialize } from '~/utils';

export interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
  storageWalletAddress: string;
}

export abstract class DividendsModule extends Entity {
  public uid: string;
  public abstract entityType: string;
  public address: string;
  public securityTokenSymbol: string;
  public securityTokenId: string;
  public storageWalletAddress: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      address,
      securityTokenSymbol,
      securityTokenId,
      storageWalletAddress,
    } = params;

    this.address = address;
    this.securityTokenSymbol = securityTokenSymbol;
    this.securityTokenId = securityTokenId;
    this.storageWalletAddress = storageWalletAddress;
    this.uid = this.generateId();
  }

  public toPojo() {
    const {
      uid,
      address,
      securityTokenSymbol,
      securityTokenId,
      storageWalletAddress,
    } = this;

    return {
      uid,
      address,
      securityTokenSymbol,
      securityTokenId,
      storageWalletAddress,
    };
  }

  protected generateId() {
    const { securityTokenSymbol, entityType } = this;
    return serialize(entityType, {
      securityTokenSymbol,
    });
  }
}
