import { Procedure } from './Procedure';
import { types } from '@polymathnetwork/new-shared';
import { CreateErc20DividendDistributionProcedureArgs } from '~/types';

export class CreateErc20DividendDistribution extends Procedure<
  CreateErc20DividendDistributionProcedureArgs
> {
  public type = types.ProcedureTypes.CreateErc20DividendDistribution;
  public async prepareTransactions() {
    const {
      symbol,
      maturityDate,
      expiryDate,
      erc20Address,
      amount,
      checkpointId,
      name,
      excludedAddresses,
      taxWithholdings = [],
    } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });
    const erc20Module = await securityToken.getErc20DividendModule();

    if (!erc20Module) {
      throw new Error(
        "Dividend modules haven't been enabled. Did you forget to call .enableDividendModules()?"
      );
    }

    await this.addTransaction(erc20Module.createDividend, {
      tag: types.PolyTransactionTags.CreateErc20DividendDistribution,
    })({
      maturityDate,
      expiryDate,
      tokenAddress: erc20Address,
      amount,
      checkpointId,
      name,
      excludedAddresses,
    });

    if (taxWithholdings.length > 0) {
      const investors: string[] = [];
      const percentages: number[] = [];

      taxWithholdings.forEach(({ address, percentage }) => {
        investors.push(address);
        percentages.push(percentage);
      });

      await this.addTransaction(erc20Module.setWithholding, {
        tag: types.PolyTransactionTags.SetErc20TaxWithholding,
      })({ investors, percentages });
    }
  }
}
