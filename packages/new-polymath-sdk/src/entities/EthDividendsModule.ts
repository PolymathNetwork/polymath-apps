import { DividendsModule, Params } from './DividendsModule';

export class EthDividendsModule extends DividendsModule {
  public entityType: string = 'ethDividendsModule';

  constructor(params: Params) {
    super(params);
  }
}
