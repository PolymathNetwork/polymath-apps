import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { serialize } from '../utils';
import { StoModule, UniqueIdentifiers, Params as StoParams } from './StoModule';

interface Params extends StoParams {
  cap: BigNumber;
  rate: BigNumber;
}

export class CappedStoModule extends StoModule {
  public static generateId({ securityTokenId, stoType, address }: UniqueIdentifiers) {
    return serialize('cappedStoModule', {
      securityTokenId,
      stoType,
      address,
    });
  }

  public uid: string;

  public cap: BigNumber;

  public rate: BigNumber;

  constructor(params: Params, polyClient?: Polymath) {
    const { cap, rate, ...rest } = params;

    super(rest, polyClient);

    const { securityTokenId, address, stoType } = rest;

    this.cap = cap;
    this.rate = rate;
    this.uid = CappedStoModule.generateId({ address, stoType, securityTokenId });
  }

  public toPojo() {
    const stoPojo = super.toPojo();
    const { cap, rate } = this;

    return {
      ...stoPojo,
      cap,
      rate,
    };
  }
}
