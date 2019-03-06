import { Polymath } from '~/Polymath';
import { serialize } from '~/utils';
import { DividendsModule } from './DividendsModule';

interface Params {
  address: string;
  securityTokenSymbol: string;
  securityTokenId: string;
  storageWalletAddress: string;
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
