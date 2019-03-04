import { DividendsModule } from './DividendsModule';
import { Polymath } from '~/Polymath';

interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
}

export class Erc20DividendsModule extends DividendsModule {
  public entityType: string = 'erc20DividendsModule';

  constructor(params: Params, polyClient?: Polymath) {
    super(params, polyClient);
  }
}
