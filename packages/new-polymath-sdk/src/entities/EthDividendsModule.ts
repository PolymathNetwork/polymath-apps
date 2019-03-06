import { DividendsModule } from './DividendsModule';
import { Polymath } from '~/Polymath';
import { serialize } from '~/utils';

interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
}

export class EthDividendsModule extends DividendsModule {
  public static generateId({
    securityTokenSymbol,
  }: {
    securityTokenSymbol: string;
  }) {
    return serialize('ethDividendsModule', {
      securityTokenSymbol,
    });
  }
  public uid: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(params, polyClient);

    this.uid = EthDividendsModule.generateId({
      securityTokenSymbol: params.securityTokenSymbol,
    });
  }
}
