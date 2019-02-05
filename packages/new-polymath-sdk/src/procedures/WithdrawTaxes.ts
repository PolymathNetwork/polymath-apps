import { Procedure } from './Procedure';
import { DividendModuleTypes } from '~/LowLevel/types';
import { DividendCheckpoint } from '~/LowLevel/DividendCheckpoint';
import { types } from '@polymathnetwork/new-shared';
import { WithdrawTaxesProcedureArgs } from '~/types';

export class WithdrawTaxes extends Procedure<WithdrawTaxesProcedureArgs> {
  public type = types.ProcedureTypes.WithdrawTaxes;
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

    await this.addTransaction(dividendModule.withdrawWithholding, {
      tag: types.PolyTransactionTags.WithdrawTaxWithholdings,
    })({ dividendIndex });
  }
}
