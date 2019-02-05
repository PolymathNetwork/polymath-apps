import { Procedure } from './Procedure';
import { DividendModuleTypes } from '~/LowLevel/types';
import { types as sharedTypes } from '@polymathnetwork/new-shared';
import { EnableDividendModulesProcedureArgs } from '~/types';

export class EnableDividendModules extends Procedure<
  EnableDividendModulesProcedureArgs
> {
  public type = sharedTypes.ProcedureTypes.EnableDividendModules;
  public async prepareTransactions() {
    const {
      symbol,
      storageWalletAddress,
      types = [DividendModuleTypes.Erc20, DividendModuleTypes.Eth],
    } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    for (const type of types) {
      await this.addTransaction(securityToken.addDividendsModule, {
        tag: sharedTypes.PolyTransactionTags.EnableDividends,
      })({ type, wallet: storageWalletAddress });
    }
  }
}
