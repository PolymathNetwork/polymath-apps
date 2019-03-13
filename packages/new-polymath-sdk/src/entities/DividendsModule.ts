import { Polymath } from '~/Polymath';
import { Entity } from './Entity';

export interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
  storageWalletAddress: string;
}

export abstract class DividendsModule extends Entity {
  public abstract uid: string;
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
}
