import { DividendsModule } from './DividendsModule';

interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
}

export class Erc20DividendsModule extends DividendsModule {
  public entityType: string = 'erc20DividendsModule';

  constructor(params: Params) {
    super(params);
  }
}
