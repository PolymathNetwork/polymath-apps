import { Procedure } from './Procedure';
import { DividendModuleTypes } from '~/LowLevel/types';
import { DividendCheckpoint } from '~/LowLevel/DividendCheckpoint';
import { types } from '@polymathnetwork/new-shared';
import { SetDividendsTaxWithholdingListProcedureArgs } from '~/types';

export class SetDividendsTaxWithholdingList extends Procedure<
  SetDividendsTaxWithholdingListProcedureArgs
> {
  public type = types.ProcedureTypes.SetDividendsTaxWithholdingList;
  public async prepareTransactions() {
    const {
      symbol,
      dividendType,
      investorAddresses: investors,
      percentages,
    } = this.args;
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

    await this.addTransaction(dividendModule.setWithholding, {
      tag: types.PolyTransactionTags.WithdrawTaxWithholdings,
    })({ investors, percentages });
  }
}
