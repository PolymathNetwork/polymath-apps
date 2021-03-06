import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { serialize } from '../utils';
import { StoModule, UniqueIdentifiers, Params as StoParams } from './StoModule';

export interface Tier {
  cap: BigNumber;
  rate: BigNumber;
}

interface Params extends StoParams {
  currentTier: number;
  tiers: Tier[];
}

export class UsdTieredStoModule extends StoModule {
  public static generateId({ symbol, stoType, address }: UniqueIdentifiers) {
    return serialize('usdTieredStoModule', {
      symbol,
      stoType,
      address,
    });
  }

  public uid: string;

  public currentTier: number;

  public tiers: Tier[];

  constructor(params: Params, polyClient?: Polymath) {
    const { currentTier, tiers, ...rest } = params;

    super(rest, polyClient);

    const { symbol, address, stoType } = rest;

    this.currentTier = currentTier;
    this.tiers = tiers;
    this.uid = UsdTieredStoModule.generateId({ address, stoType, symbol });
  }

  public toPojo() {
    const stoPojo = super.toPojo();
    const { currentTier, tiers } = this;

    return {
      ...stoPojo,
      currentTier,
      tiers,
    };
  }
}
