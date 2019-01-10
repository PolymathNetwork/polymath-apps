import { Procedure } from './Procedure';
import { DividendModuleTypes } from '~/LowLevel/types';
import { types as sharedTypes } from '@polymathnetwork/new-shared';

interface Args {
  symbol: string;
  types?: DividendModuleTypes[];
}

export class EnableDividendModules extends Procedure<Args> {
  public async prepareTransactions() {
    const {
      symbol,
      types = [DividendModuleTypes.Erc20, DividendModuleTypes.Eth],
    } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken(symbol);

    for (const type of types) {
      await this.addTransaction(securityToken.addDividendsModule, {
        tag: sharedTypes.PolyTransactionTags.EnableDividends,
      })(type);
    }
  }
}
