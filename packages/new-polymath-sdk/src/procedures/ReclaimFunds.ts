import { Procedure } from './Procedure';
import { DividendModuleTypes } from '~/LowLevel/types';
import { DividendCheckpoint } from '~/LowLevel/DividendCheckpoint';
import { types } from '@polymathnetwork/new-shared';
import { ReclaimFundsProcedureArgs } from '~/types';

export class ReclaimFunds extends Procedure<ReclaimFundsProcedureArgs> {
  public type = types.ProcedureTypes.ReclaimFunds;
  public async prepareTransactions() {
    const { symbol, dividendIndex, dividendType } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    let dividendModule: DividendCheckpoint | null = null;

    switch (dividendType) {
      case DividendModuleTypes.Erc20:
        dividendModule = await securityToken.getErc20DividendModule();
        break;
      case DividendModuleTypes.Eth:
        dividendModule = await securityToken.getEtherDividendModule();
    }

    if (!dividendModule) {
      throw new Error(
        'There is no attached dividend module of the specified type'
      );
    }

    await this.addTransaction(dividendModule.reclaimDividend, {
      tag: types.PolyTransactionTags.ReclaimDividendFunds,
    })({ dividendIndex });
  }
}
