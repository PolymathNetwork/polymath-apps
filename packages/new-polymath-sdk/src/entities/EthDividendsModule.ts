import { Polymath } from '../Polymath';
import { serialize } from '../utils';
import { DividendsModule, Params, UniqueIdentifiers } from './DividendsModule';
import { DividendModuleTypes, Omit } from '../types';

export class EthDividendsModule extends DividendsModule {
  public static generateId({ symbol, dividendType }: UniqueIdentifiers) {
    return serialize('ethDividendsModule', {
      symbol,
      dividendType,
    });
  }

  public uid: string;

  constructor(
    { symbol, address, storageWalletAddress }: Omit<Params, 'dividendType'>,
    polyClient?: Polymath
  ) {
    const dividendType = DividendModuleTypes.Eth;
    super(
      {
        symbol,
        dividendType,
        address,
        storageWalletAddress,
      },
      polyClient
    );

    this.uid = EthDividendsModule.generateId({
      symbol,
      dividendType,
    });
  }
}
