import { DividendsModule, Params, UniqueIdentifiers } from './DividendsModule';
import { Polymath } from '../Polymath';
import { serialize } from '../utils';
import { DividendModuleTypes, Omit } from '../types';

export class Erc20DividendsModule extends DividendsModule {
  public static generateId({ symbol, dividendType }: UniqueIdentifiers) {
    return serialize('erc20DividendsModule', {
      symbol,
      dividendType,
    });
  }

  public uid: string;

  constructor(
    { symbol, address, storageWalletAddress }: Omit<Params, 'dividendType'>,
    polyClient?: Polymath
  ) {
    const dividendType = DividendModuleTypes.Erc20;
    super(
      {
        symbol,
        address,
        storageWalletAddress,
        dividendType,
      },
      polyClient
    );

    this.uid = Erc20DividendsModule.generateId({
      symbol,
      dividendType,
    });
  }
}
