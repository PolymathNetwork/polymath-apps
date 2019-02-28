import { DividendsModule } from './DividendsModule';

interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
}

export class EthDividendsModule extends DividendsModule {
  public entityType: string = 'ethDividendsModule';

  constructor(params: Params) {
    super(params);
  }
}
