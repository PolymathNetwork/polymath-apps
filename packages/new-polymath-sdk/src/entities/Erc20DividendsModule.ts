import { DividendsModule, Params } from './DividendsModule';
import { Polymath } from '~/Polymath';
import { serialize } from '~/utils';

export class Erc20DividendsModule extends DividendsModule {
  public static generateId({
    securityTokenSymbol,
  }: {
    securityTokenSymbol: string;
  }) {
    return serialize('erc20DividendsModule', {
      securityTokenSymbol,
    });
  }
  public entityType: string = 'erc20DividendsModule';
  public uid: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(params, polyClient);

    this.uid = Erc20DividendsModule.generateId({
      securityTokenSymbol: params.securityTokenSymbol,
    });
  }
}
