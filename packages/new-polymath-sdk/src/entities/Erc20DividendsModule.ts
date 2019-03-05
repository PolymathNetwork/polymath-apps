import { DividendsModule, Params } from './DividendsModule';
import { Polymath } from '~/Polymath';

export class Erc20DividendsModule extends DividendsModule {
  public entityType: string = 'erc20DividendsModule';

  constructor(params: Params, polyClient?: Polymath) {
    super(params, polyClient);
  }
}
