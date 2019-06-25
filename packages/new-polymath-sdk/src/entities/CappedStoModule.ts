import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { serialize } from '../utils';
import { StoModule, UniqueIdentifiers, Params as StoParams } from './StoModule';

interface Params extends StoParams {
  cap: BigNumber;
  rate: BigNumber;
}

export class CappedStoModule extends StoModule {
  public static generateId({ symbol, stoType, address }: UniqueIdentifiers) {
    return serialize('cappedStoModule', {
      symbol,
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

    const { symbol, address, stoType } = rest;

    this.cap = cap;
    this.rate = rate;
    this.uid = CappedStoModule.generateId({ address, stoType, symbol });
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
